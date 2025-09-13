import { Body, Controller, Post} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from '@nestjs/config';
import { GoogleAuthService } from 'src/modules/google';
import { AuthService } from "./auth.service";
import { FirebaseOTPDto, FirebaseVerifyOTPDto, LoginRequestDto, RegisterRequestDto, GoogleTokenDto } from "./dtos";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private googleAuthService: GoogleAuthService,
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

	@Post("send-otp")
	sendOtp(@Body() dto: FirebaseOTPDto) {
		return this.authService.sendOtp(dto);
	}

	@Post("verify-otp")
	verifyOtp(@Body() dto: FirebaseVerifyOTPDto) {
		return this.authService.verifyOtp(dto);
	}

	@Post('google/token')
	async googleTokenLogin(@Body() dto: GoogleTokenDto) {
		const result = await this.googleAuthService.handleGoogleTokenLogin(dto.idToken);
			return {
				success: true,
				...result
			};
	}
}
