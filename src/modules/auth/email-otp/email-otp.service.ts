import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import * as crypto from "crypto";
import { EmailOtp } from "src/core/database/sql/entities/email-otp";
import { User } from "src/core/database/sql/entities/user";
import { LessThan, Repository } from "typeorm";
import { AuthService } from "../auth.service";
import { LoginResponseDto } from "../dtos";
import { EmailService } from "./email.service";

interface TestEmailMap {
	[key: string]: string;
}
@Injectable()
export class EmailOtpService {
	private readonly OTP_EXPIRY_MINUTES = 5;

	private readonly MAX_ATTEMPTS = 5;

	private readonly recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

	private readonly recaptchaScoreThreshold = process.env.RECAPTCHA_SCORE_THRESHOLD;

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
	async sendOtp(email: string, recaptchaToken: string): Promise<{ message: string }> {
		try {
			// Check recaptcha
			const isValid = await this.validateRecaptcha(recaptchaToken);
			if (!isValid) {
				throw new BadRequestException("RECAPTCHA_VALIDATION_FAILED");
			}

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
					throw new BadRequestException("OTP_REQUEST_TOO_FREQUENT");
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
				message: "OTP_SENT_SUCCESSFULLY"
			};
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new BadRequestException("SEND_OTP_FAILED", error);
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
				throw new UnauthorizedException("OTP_NOT_FOUND");
			}

			// Check expire
			if (emailOtpEntity.expires_at < new Date()) {
				await this.emailOtpRepository.update(emailOtpEntity.id, { used: true });
				throw new UnauthorizedException("OTP_EXPIRED");
			}

			// Check attempt count
			if (emailOtpEntity.attempt_count >= this.MAX_ATTEMPTS) {
				await this.emailOtpRepository.update(emailOtpEntity.id, { used: true });
				throw new UnauthorizedException("MAX_OTP_ATTEMPTS_EXCEEDED");
			}

			// Check match OTP
			const otpHash = this.hashOtp(otp);
			if (emailOtpEntity.otp_hash !== otpHash) {
				// Inc attempt count
				await this.emailOtpRepository.update(emailOtpEntity.id, {
					attempt_count: emailOtpEntity.attempt_count + 1
				});
				throw new UnauthorizedException("OTP_INVALID");
			}

			// OTP match
			await this.emailOtpRepository.update(emailOtpEntity.id, { used: true });

			// Find or Create user
			const user = await this.userRepository.findOne({ where: { email } });

			if (!user) {
				throw new NotFoundException({
					message: "USER_NOT_FOUND",
					email
				});
			}

			return await this.authService.generateTokens(user);
		} catch (error) {
			if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
				throw error;
			}
			throw new UnauthorizedException({
				message: "OTP_VERIFICATION_FAILED",
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

	/**
	 * Verify reCaptcha token with Google
	 */
	private async validateRecaptcha(recaptchaToken: string): Promise<boolean> {
		try {
			const response = await axios.postForm("https://www.google.com/recaptcha/api/siteverify", {
				secret: this.recaptchaSecret,
				response: recaptchaToken
			});
			return response.data.success && (response.data.score ?? 1) >= this.recaptchaScoreThreshold;
		} catch {
			return false;
		}
	}

	private testEmails: TestEmailMap = {
		"registered@test.mail": "363636",
		"unregistered@test.mail": "036036"
	};

	async sendOtpTest(email: string, recaptchaToken: string): Promise<{ message: string }> {
		if (email in this.testEmails) {
			return {
				message: "OTP_SENT_SUCCESSFULLY"
			};
		}
		return this.sendOtp(email, recaptchaToken);
	}

	async verifyOtpTest(email: string, otp: string): Promise<LoginResponseDto> {
		if (email in this.testEmails) {
			if (this.testEmails[email] !== otp) {
				throw new UnauthorizedException("OTP_INVALID");
			}

			const user = await this.userRepository.findOne({ where: { email } });
			if (!user) {
				throw new NotFoundException({
					message: "USER_NOT_FOUND",
					email
				});
			}
			return this.authService.generateTokens(user);
		}
		return this.verifyOtp(email, otp);
	}

}
