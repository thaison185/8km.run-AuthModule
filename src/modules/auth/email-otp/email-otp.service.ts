import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as crypto from "crypto";
import { EmailOtp } from "src/core/database/sql/entities/email-otp";
import { User } from "src/core/database/sql/entities/user";
import { LessThan, Repository } from "typeorm";
import { AuthService } from "../auth.service";
import { LoginResponseDto } from "../dtos";
import { EmailService } from "./email.service";

@Injectable()
export class EmailOtpService {
	private readonly OTP_EXPIRY_MINUTES = 5;

	private readonly MAX_ATTEMPTS = 5;

	constructor(
		@InjectRepository(EmailOtp)
		private emailOtpRepository: Repository<EmailOtp>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private emailService: EmailService,
		private authService: AuthService
	) {}

	/**
	 * Tạo và gửi OTP qua email
	 */
	async sendOtp(email: string): Promise<{ message: string }> {
		try {
			// Check rate limit
			const recentOtp = await this.emailOtpRepository.findOne({
				where: {
					email,
					used: false
				},
				order: { created_at: "DESC" }
			});

			if (recentOtp) {
				const timeSinceCreated = Date.now() - recentOtp.created_at.getTime();
				if (timeSinceCreated < 60 * 1000) {
					// 1 min
					throw new BadRequestException("Please wait 1 minute before requesting new OTP");
				}
			}

			// Disable old OTPs
			await this.emailOtpRepository.update({ email, used: false }, { used: true });

			// Generate new OTP (6 digits)
			const otp = this.generateOtp();
			const otpHash = this.hashOtp(otp);

			const expiresAt = new Date();
			expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

			// Save OTP
			const emailOtpEntity = this.emailOtpRepository.create({
				email,
				otp_hash: otpHash,
				expires_at: expiresAt,
				attempt_count: 0,
				used: false
			});

			await this.emailOtpRepository.save(emailOtpEntity);

			// Send email
			await this.emailService.sendOtpEmail(email, otp);

			return {
				message: "OTP sent successfully to your email"
			};
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new BadRequestException("Failed to send OTP");
		}
	}

	/**
	 * Verify OTP and Login
	 */
	async verifyOtp(email: string, otp: string): Promise<LoginResponseDto> {
		try {
			// Find unused OTP
			const emailOtpEntity = await this.emailOtpRepository.findOne({
				where: {
					email,
					used: false
				},
				order: { created_at: "DESC" }
			});

			if (!emailOtpEntity) {
				throw new UnauthorizedException("Invalid or expired OTP");
			}

			// Check expire
			if (emailOtpEntity.expires_at < new Date()) {
				await this.emailOtpRepository.update(emailOtpEntity.id, { used: true });
				throw new UnauthorizedException("OTP has expired");
			}

			// Check attempt count
			if (emailOtpEntity.attempt_count >= this.MAX_ATTEMPTS) {
				await this.emailOtpRepository.update(emailOtpEntity.id, { used: true });
				throw new UnauthorizedException("Too many invalid attempts");
			}

			// Check match OTP
			const otpHash = this.hashOtp(otp);
			if (emailOtpEntity.otp_hash !== otpHash) {
				// Inc attempt count
				await this.emailOtpRepository.update(emailOtpEntity.id, {
					attempt_count: emailOtpEntity.attempt_count + 1
				});
				throw new UnauthorizedException("Invalid OTP");
			}

			// OTP match
			await this.emailOtpRepository.update(emailOtpEntity.id, { used: true });

			// Find or Create user
			const user = await this.userRepository.findOne({ where: { email } });

			if (!user) {
				throw new NotFoundException({
					message: "User not found, please register!",
					email
				});
			}

			// Tạo và trả về tokens
			return await this.authService.generateTokens(user);
		} catch (error) {
			if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
				throw error;
			}
			throw new UnauthorizedException({
				message: "OTP verification failed",
				error
			});
		}
	}

	/**
	 * Generate OTP - 6 random digits
	 */
	private generateOtp(): string {
		const otpNumber = crypto.randomInt(0, 1000000); // 0 đến 999999
		return otpNumber.toString().padStart(6, "0");
	}

	/**
	 * Hash OTP
	 */
	private hashOtp(otp: string): string {
		return crypto.createHash("sha256").update(otp).digest("hex");
	}

	/**
	 * Cleanup expired OTPs (schedule)
	 */
	async cleanupExpiredOtp(): Promise<void> {
		await this.emailOtpRepository.delete({
			expires_at: LessThan(new Date())
		});
	}
}
