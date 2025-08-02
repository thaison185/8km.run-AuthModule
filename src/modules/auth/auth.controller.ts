import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginRequestDto, RegisterRequestDto } from "./dtos";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	async login(@Body() dto: LoginRequestDto) {
		return this.authService.login(dto);
	}

	@Post("register")
	async register(@Body() dto: RegisterRequestDto) {
		return this.authService.register(dto);
	}
}
