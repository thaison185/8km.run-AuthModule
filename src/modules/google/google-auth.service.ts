import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { OAuth2Client } from "google-auth-library";
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

	async loginWithGoogle(authCode: string) {
		const idToken = await this.exchangeAuthCode(authCode);

		return this.handleGoogleTokenLogin(idToken);
	}

	/**
	 * Exchange auth code for id_token
	 */
	private async exchangeAuthCode(authCode: string) {
		try {
			const { tokens } = await this.googleClient.getToken(authCode);

			if (!tokens || !tokens.id_token) {
				throw new UnauthorizedException("ID_TOKEN_NOT_FOUND");
			}

			return tokens.id_token;
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error;
			}

			throw new UnauthorizedException({
				message: "AUTH_CODE_EXCHANGE_FAILED",
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
				throw new UnauthorizedException("INVALID_TOKEN_PAYLOAD");
			}

			if (!payload.email_verified) {
				throw new UnauthorizedException("EMAIL_NOT_VERIFIED");
			}
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error;
			}

			throw new UnauthorizedException({
				message: "TOKEN_VERIFICATION_FAILED",
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
					throw new UnauthorizedException("GOOGLE_ID_MISMATCH");
				}

				// Update google_id if not exist
				if (!user.googleId) {
					user.googleId = googleUser.googleId;
					await this.userRepository.save(user);
				}
			} else {
				// Return to frontend to move to registration UI
				throw new NotFoundException({
					message: "USER_NOT_FOUND",
					googleUser: {
						googleId: googleUser.googleId,
						email: googleUser.email,
						name: googleUser.name
					}
				});
			}

			// Generate JWT tokens
			return await this.authService.generateTokens(user);
		} catch (error) {
			if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
				throw error;
			}

			throw new InternalServerErrorException({
				message: "GOOGLE_LOGIN_FAILED",
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
