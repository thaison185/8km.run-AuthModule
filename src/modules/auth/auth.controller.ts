import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/common/decorators/public.decorator";
import { RequestContext } from "src/common/decorators/request-context.decorator";
import { GoogleAuthService } from "src/modules/google";
import { AuthService } from "./auth.service";
import {
	FirebaseOTPDto,
	FirebaseVerifyOTPDto,
	GoogleTokenDto,
	RefreshTokenDto,
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
		private readonly emailOtpService: EmailOtpService
	) {}

	@Post("register")
	@Public()
	async register(@Body() dto: RegisterRequestDto, @RequestContext() context: { ip: string; userAgent: string }) {
		return this.authService.register(dto, context.userAgent, context.ip);
	}

	@Post("phone/send-otp")
	@Public()
	sendOtp(@Body() dto: FirebaseOTPDto) {
		return this.authService.sendOtp(dto);
	}

	@Post("phone/verify-otp")
	@Public()
	verifyOtp(@Body() dto: FirebaseVerifyOTPDto, @RequestContext() context: { ip: string; userAgent: string }) {
		return this.authService.verifyOtp(dto, context.userAgent, context.ip);
	}

	@Post("google")
	@Public()
	async googleTokenLogin(@Body() dto: GoogleTokenDto, @RequestContext() context: { ip: string; userAgent: string }) {
		const result = await this.googleAuthService.loginWithGoogle(dto.authCode, context.userAgent, context.ip);
		return {
			success: true,
			...result
		};
	}

	@Post("mail/send-otp")
	@Public()
	async sendEmailOtp(@Body() dto: SendEmailOtpDto) {
		return this.emailOtpService.sendOtpTest(dto.email, dto.recaptchaToken);
	}

	@Post("mail/verify-otp")
	@Public()
	async verifyEmailOtp(@Body() dto: VerifyEmailOtpDto, @RequestContext() context: { ip: string; userAgent: string }) {
		return this.emailOtpService.verifyOtpTest(dto.email, dto.otp, context.userAgent, context.ip);
	}

	@Post("logout")
	async logout(@Body() dto: RefreshTokenDto) {
		return this.authService.logout(dto.refreshToken);
	}

	@Post("refresh-token")
	@Public()
	async refreshToken(@Body() dto: RefreshTokenDto, @RequestContext() context: { ip: string; userAgent: string }) {
		return this.authService.refreshTokens(dto.refreshToken, context.userAgent, context.ip);
	}
}
