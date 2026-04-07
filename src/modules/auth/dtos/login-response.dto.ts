import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const LoginResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
	user: z.object({
		id: z.string(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		phone: z.string(),
		email: z.string()
	})
});

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}
