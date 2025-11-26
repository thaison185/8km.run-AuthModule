import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { JwtConfig } from "src/common/config/jwt.config";
import { ClientErrors } from "src/common/error-messages";
import { IJwt } from "src/common/types";
import { SessionData } from "src/common/types/sessionData";
import { RefreshToken } from "src/core/database/sql/entities/refresh-token";
import { Session } from "src/core/database/sql/entities/session";
import { User } from "src/core/database/sql/entities/user";
import { Repository } from "typeorm";
import { FirebaseService } from "../firebase";
import { AuthGuard } from "./auth.guard";
import { FirebaseOTPDto, FirebaseVerifyOTPDto, LoginResponseDto, RegisterRequestDto } from "./dtos";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(RefreshToken)
		private readonly refreshTokenRepository: Repository<RefreshToken>,
		@InjectRepository(Session)
		private readonly sessionRepository: Repository<Session>,
		private readonly authGuard: AuthGuard,
		private readonly jwtService: JwtService,
		private readonly firebaseService: FirebaseService,
		@Inject(JwtConfig.KEY)
		private readonly jwtConfigService: ConfigType<typeof JwtConfig>
	) {}

	async sendOtp(otpDto: FirebaseOTPDto) {
		// Send OTP with Firebase
		return this.firebaseService.sendOtp(otpDto.phone, otpDto.recaptchaToken);
	}

	// Verify and login Firebase
	async verifyOtp(verifyDto: FirebaseVerifyOTPDto, userAgent: string, ip: string): Promise<LoginResponseDto> {
		// Verify OTP with Firebase
		const { phoneNumber } = await this.firebaseService.verifyOtp(verifyDto.sessionInfo, verifyDto.otp);

		// Check Phone number
		if (phoneNumber !== verifyDto.phone) throw new UnauthorizedException(ClientErrors.Unauthorized.PhoneMismatch);

		// Find user in DB
		const user = await this.userRepository.findOne({ where: { phone: phoneNumber } });
		if (!user) throw new UnauthorizedException(ClientErrors.Unauthorized.PhoneNotRegistered);

		return this.createSessionAndTokens(user, userAgent, ip);
	}

	// TODO: Implement register
	async register(registerDto: RegisterRequestDto, userAgent: string, ip: string): Promise<LoginResponseDto> {
		// Check if user already exists
		const existingUser = await this.userRepository.findOne({
			where: [{ phone: registerDto.phone }]
		});

		if (existingUser) {
			throw new UnauthorizedException(ClientErrors.Unauthorized.UserAlreadyExist);
		}

		// Return User[] here
		const userEntity = this.userRepository.create({ ...registerDto });
		const user = await this.userRepository.save(userEntity);

		// But generateTokens need User param
		return this.createSessionAndTokens(user, userAgent, ip);
	}

	/**
	 * Refresh token
	 */
	async refreshTokens(refreshToken: string, userAgent: string, ip: string): Promise<LoginResponseDto> {
		try {
			const payload = await this.authGuard.validateRefreshToken(refreshToken);

			const user = await this.userRepository.findOne({ where: { id: payload.id } });

			if (!user) {
				throw new NotFoundException(ClientErrors.NotFound.UserNotFound);
			}

			const isValid = await this.findRefreshToken(user.id, payload.refreshTokenId);

			if (isValid) {
				// Delete the used refresh token
				await this.refreshTokenRepository.delete({
					user_id: user.id,
					refreshTokenId: payload.refreshTokenId
				});
			} else {
				throw new Error();
			}

			await this.authGuard.destroySession(payload);

			await this.sessionRepository.delete({ id: payload.session });

			return await this.createSessionAndTokens(user, userAgent, ip);
		} catch (err) {
			if (err instanceof NotFoundException) {
				// Clean up invalid refresh tokens for this user
				await this.refreshTokenRepository.delete({
					user_id: refreshToken ? ((await this.jwtService.decode(refreshToken)) as { id?: string })?.id : null
				});
			}

			throw new UnauthorizedException(ClientErrors.Unauthorized.RefreshTokenInvalid);
		}
	}

	private async findRefreshToken(user_id: string, tokenId: string): Promise<boolean> {
		const storedToken = await this.refreshTokenRepository.findOne({
			where: {
				user_id,
				refreshTokenId: tokenId
			}
		});

		if (!storedToken || storedToken.refreshTokenId !== tokenId) {
			throw new Error();
		}

		// Check if token is expired
		if (storedToken.expiresAt && storedToken.expiresAt < new Date()) {
			await this.refreshTokenRepository.delete({ id: storedToken.id });
			throw new Error();
		}

		return storedToken.refreshTokenId === tokenId;
	}

	/**
	 * Logout this device
	 */
	async logout(refreshToken: string): Promise<void> {
		try {
			const payload = await this.authGuard.validateRefreshToken(refreshToken);

			const user = await this.userRepository.findOne({ where: { id: payload.id } });

			if (!user) {
				throw new NotFoundException(ClientErrors.NotFound.UserNotFound);
			}

			const isValid = await this.findRefreshToken(user.id, payload.refreshTokenId);

			if (isValid) {
				// Delete the used refresh token
				await this.refreshTokenRepository.delete({
					user_id: user.id,
					refreshTokenId: payload.refreshTokenId
				});
			} else {
				throw new Error();
			}
			await this.authGuard.destroySession(payload);

			await this.sessionRepository.update({ id: payload.session }, { status: false, expiresAt: new Date() });
		} catch (error) {
			if (error instanceof NotFoundException) {
				// Clean up invalid refresh tokens for this user
				await this.refreshTokenRepository.delete({
					user_id: refreshToken ? ((await this.jwtService.decode(refreshToken)) as { id?: string })?.id : null
				});
			}
			throw new UnauthorizedException(ClientErrors.Unauthorized.RefreshTokenInvalid);
		}
	}

	/**
	 * Logout all Session
	 */
	async logoutAllDevices(userId: string): Promise<void> {
		await this.authGuard.destroyAllSessions(userId);

		await this.sessionRepository.update({ userId }, { status: false, expiresAt: new Date() });

		await this.refreshTokenRepository.delete({ user_id: userId });
	}

	/**
	 * Create session, access token, refresh token
	 */
	async createSessionAndTokens(user: User, userAgent: string, ip: string): Promise<LoginResponseDto> {
		const sessionId = randomUUID();

		const sessionData: SessionData = {
			userId: user.id,
			createdAt: new Date(),
			userAgent,
			ip
		};

		const expiresAt = new Date();
		const sessionExp = this.jwtConfigService.sessionTtl;
		expiresAt.setTime(expiresAt.getTime() + sessionExp * 1000);

		// Save session into Database
		await this.sessionRepository.save({
			id: sessionId,
			userId: user.id,
			userAgent,
			ip,
			status: true,
			expiresAt
		});

		const { id, firstname, lastname, email, phone } = user;
		const accessPayload: IJwt = {
			id,
			session: sessionId,
			data: {
				firstname,
				lastname,
				email,
				phone
			}
		};

		const refreshTokenId = randomUUID();

		const refreshPayload: IJwt = {
			id,
			session: sessionId,
			data: {
				refreshTokenId
			}
		};

		const accessToken = await this.authGuard.createAccessToken(accessPayload);

		const refreshToken = await this.authGuard.createRefreshToken(refreshPayload, sessionData, sessionExp);

		// Save refresh token into database
		const refreshTokenExpiresAt = new Date();
		refreshTokenExpiresAt.setTime(refreshTokenExpiresAt.getTime() + this.jwtConfigService.refreshTokenTtl * 1000);

		await this.refreshTokenRepository.save({
			user_id: user.id,
			refreshTokenId,
			expiresAt: refreshTokenExpiresAt
		});

		return {
			accessToken,
			refreshToken,
			user
		};
	}
}
