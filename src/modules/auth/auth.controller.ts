import { Body, Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { GoogleAuthService } from "src/modules/google";
import { AuthService } from "./auth.service";
import {
	FirebaseOTPDto,
	FirebaseVerifyOTPDto,
	GoogleTokenDto,
	LoginRequestDto,
	RegisterRequestDto,
	SendEmailOtpDto,
	VerifyEmailOtpDto
} from "./dtos";
import { EmailOtpService } from "./email-otp";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly googleAuthService: GoogleAuthService,
		private readonly emailOtpService: EmailOtpService,
		private configService: ConfigService
	) {}

	@Post("login")
	async login(@Body() dto: LoginRequestDto) {
		return this.authService.login(dto);
	}

	@Post("register")
	async register(@Body() dto: RegisterRequestDto) {
		return this.authService.register(dto);
	}

	@Post("phone/send-otp")
	sendOtp(@Body() dto: FirebaseOTPDto) {
		return this.authService.sendOtp(dto);
	}

	@Post("phone/verify-otp")
	verifyOtp(@Body() dto: FirebaseVerifyOTPDto) {
		return this.authService.verifyOtp(dto);
	}

	@Post("google")
	async googleTokenLogin(@Body() dto: GoogleTokenDto) {
		const result = await this.googleAuthService.loginWithGoogle(dto.authCode);
		return {
			success: true,
			...result
		};
	}

	@Post("email/send-otp")
	async sendEmailOtp(@Body() dto: SendEmailOtpDto) {
		return this.emailOtpService.sendOtp(dto.email);
	}

	@Post("email/verify-otp")
	async verifyEmailOtp(@Body() dto: VerifyEmailOtpDto) {
		return this.emailOtpService.verifyOtp(dto.email, dto.otp);
	}
}
