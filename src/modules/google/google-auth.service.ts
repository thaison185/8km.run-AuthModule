import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { OAuth2Client } from "google-auth-library";
import { ClientErrors } from "src/common/error-messages";
import { User } from "src/core/database/sql/entities/user";
import { AuthService } from "src/modules/auth/auth.service";
import { Repository } from "typeorm";

export interface GoogleTokenPayload {
	sub: string; // Google ID
	email: string;
	name: string;
	email_verified: boolean;
}

export interface GoogleUser {
	googleId: string;
	email: string;
	name: string;
	emailVerified: boolean;
}

@Injectable()
export class GoogleAuthService {
	private googleClient: OAuth2Client;

	private userAgent: string;

	private ip: string;

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private authService: AuthService,
		private configService: ConfigService
	) {
		this.googleClient = new OAuth2Client(
			this.configService.get("GOOGLE_CLIENT_ID"),
			this.configService.get("GOOGLE_CLIENT_SECRET"),
			this.configService.get("GOOGLE_REDIRECT_URI")
		);
	}

	/**
	 * Main handler login with google method
	 */

	async loginWithGoogle(authCode: string, userAgent: string, ip: string) {
		const idToken = await this.exchangeAuthCode(authCode);
		this.userAgent = userAgent;
		this.ip = ip;
		return this.handleGoogleTokenLogin(idToken);
	}

	/**
	 * Exchange auth code for id_token
	 */
	private async exchangeAuthCode(authCode: string) {
		try {
			const { tokens } = await this.googleClient.getToken(authCode);

			if (!tokens || !tokens.id_token) {
				throw new UnauthorizedException(ClientErrors.Unauthorized.IdTokenNotFound);
			}

			return tokens.id_token;
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error;
			}

			throw new UnauthorizedException({
				message: ClientErrors.Unauthorized.AuthCodeExchangeFailed,
				error
			});
		}
	}

	/**
	 * Verify Google ID Token and handle login logic
	 */
	private async handleGoogleTokenLogin(idToken: string) {
		let payload;
		try {
			// Verify ID token with Google
			const ticket = await this.googleClient.verifyIdToken({
				idToken,
				audience: this.configService.get("GOOGLE_CLIENT_ID")
			});

			payload = ticket.getPayload();

			if (!payload) {
				throw new UnauthorizedException(ClientErrors.Unauthorized.InvalidTokenPayload);
			}

			if (!payload.email_verified) {
				throw new UnauthorizedException(ClientErrors.Unauthorized.EmailNotVerified);
			}
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error;
			}

			throw new UnauthorizedException({
				message: ClientErrors.Unauthorized.TokenVerificationFailed,
				error
			});
		}

		const googleUser: GoogleUser = {
			googleId: payload.sub,
			email: payload.email,
			name: payload.name,
			emailVerified: payload.email_verified
		};
		return this.processGoogleUser(googleUser);
	}

	/**
	 * Handle login logic
	 */
	private async processGoogleUser(googleUser: GoogleUser) {
		try {
			const user = await this.findUserByGoogleOrEmail(googleUser.googleId, googleUser.email);

			if (user) {
				// User exist
				if (user.googleId && user.googleId !== googleUser.googleId) {
					throw new UnauthorizedException(ClientErrors.Unauthorized.GoogleIdMismatch);
				}

				// Update google_id if not exist
				if (!user.googleId) {
					user.googleId = googleUser.googleId;
					await this.userRepository.save(user);
				}
			} else {
				// Return to frontend to move to registration UI
				throw new NotFoundException({
					message: ClientErrors.NotFound.UserNotFound,
					googleUser: {
						googleId: googleUser.googleId,
						email: googleUser.email,
						name: googleUser.name
					}
				});
			}

			// Generate JWT tokens
			return await this.authService.createSessionAndTokens(user, this.userAgent, this.ip);
		} catch (error) {
			if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
				throw error;
			}

			throw new InternalServerErrorException({
				message: ClientErrors.InternalServerError.GoogleLoginFailed,
				error
			});
		}
	}

	private async findUserByGoogleOrEmail(googleId: string, email: string): Promise<User | null> {
		return this.userRepository.findOne({
			where: [{ googleId }, { email }]
		});
	}
}
