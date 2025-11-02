import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { JwtConfig } from "src/common/config";
import { ClientErrors } from "src/common/error-messages";
import { RefreshToken } from "src/core/database/sql/entities/refresh-token";
import { User } from "src/core/database/sql/entities/user";
import { Repository } from "typeorm";
import { FirebaseService } from "../firebase";
import { FirebaseOTPDto, FirebaseVerifyOTPDto, LoginResponseDto, RefreshTokenDto, RegisterRequestDto } from "./dtos";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		@InjectRepository(RefreshToken)
		private readonly refreshTokenRepo: Repository<RefreshToken>,
		private readonly jwtService: JwtService,
		private readonly firebaseService: FirebaseService,
		@Inject(JwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof JwtConfig>
	) {}

	// Dummy Logout for testing
	async logout(user_id: string): Promise<void> {
		// Delete all refresh tokens for this user
		await this.refreshTokenRepo.delete({ user_id });
	}

	// Dummy register for testing
	async register(registerDto: RegisterRequestDto): Promise<LoginResponseDto> {
		// Check if user already exists
		const existingUser = await this.userRepo.findOne({
			where: [{ phone: registerDto.phone }]
		});

		if (existingUser) {
			throw new UnauthorizedException(ClientErrors.Unauthorized.UserAlreadyExist);
		}

		// Return User[] here
		const userEntity = this.userRepo.create({ ...registerDto });
		const user = await this.userRepo.save(userEntity);

		// But generateTokens need User param
		return this.generateTokens(user);
	}

	async generateTokens(user: User): Promise<LoginResponseDto> {
		const refreshTokenId = randomUUID();
		const { id, firstname, lastname, email, phone } = user;

		const [accessToken, refreshToken] = await Promise.all([
			this.signToken(id, this.jwtConfiguration.accessTokenTtl, this.jwtConfiguration.accessSecret, {
				firstname,
				lastname,
				email,
				phone
			}),
			this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, this.jwtConfiguration.refreshSecret, {
				refreshTokenId
			})
		]);

		// Store refresh token in database
		const expiresAt = new Date();
		expiresAt.setTime(expiresAt.getTime() + this.jwtConfiguration.refreshTokenTtl * 1000);

		await this.refreshTokenRepo.save({
			user_id: id,
			refreshTokenId,
			expiresAt
		});

		return {
			accessToken,
			refreshToken,
			user: {
				id: user.id,
				firstname: user.firstname,
				lastname: user.lastname,
				phone: user.phone,
				email: user.email
			}
		};
	}

	private async signToken<T>(user_id: string, expiresIn: number, secret: string, payload?: T): Promise<string> {
		return this.jwtService.signAsync(
			{
				sub: user_id,
				...payload
			},
			{
				secret,
				expiresIn
			}
		);
	}

	async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
		try {
			const { sub, refreshTokenId } = await this.jwtService.verifyAsync<{
				sub: string;
				refreshTokenId: string;
			}>(refreshTokenDto.refreshToken, {
				secret: this.jwtConfiguration.refreshSecret
			});

			const user = await this.userRepo.findOne({
				where: { id: sub }
			});

			if (!user) {
				throw new NotFoundException(ClientErrors.NotFound.UserNotFound);
			}

			const isValid = await this.findRefreshToken(user.id, refreshTokenId);

			if (isValid) {
				// Delete the used refresh token
				await this.refreshTokenRepo.delete({
					user_id: user.id,
					refreshTokenId
				});
			} else {
				throw new Error();
			}

			return await this.generateTokens(user);
		} catch (err) {
			if (err instanceof NotFoundException) {
				// Clean up invalid refresh tokens for this user
				await this.refreshTokenRepo.delete({
					user_id: refreshTokenDto.refreshToken
						? ((await this.jwtService.decode(refreshTokenDto.refreshToken)) as { sub?: string })?.sub
						: null
				});
			}

			throw new UnauthorizedException(ClientErrors.Unauthorized.RefreshTokenInvalid);
		}
	}

	private async findRefreshToken(user_id: string, tokenId: string): Promise<boolean> {
		const storedToken = await this.refreshTokenRepo.findOne({
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
			await this.refreshTokenRepo.delete({ id: storedToken.id });
			throw new Error();
		}

		return storedToken.refreshTokenId === tokenId;
	}

	async sendOtp(otpDto: FirebaseOTPDto) {
		// Send OTP with Firebase
		return this.firebaseService.sendOtp(otpDto.phone, otpDto.recaptchaToken);
	}

	// Verify and login
	async verifyOtp(verifyDto: FirebaseVerifyOTPDto) {
		// Verify OTP with Firebase
		const { phoneNumber } = await this.firebaseService.verifyOtp(verifyDto.sessionInfo, verifyDto.otp);

		// Check Phone number
		if (phoneNumber !== verifyDto.phone) throw new UnauthorizedException(ClientErrors.Unauthorized.PhoneMismatch);

		// Find user in DB
		const user = await this.userRepo.findOne({ where: { phone: phoneNumber } });
		if (!user) throw new UnauthorizedException(ClientErrors.Unauthorized.PhoneNotRegistered);

		// Generate token to login
		return this.generateTokens(user);
	}
}
