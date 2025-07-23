import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const LoginSchema = z.object({
	phone: z.string().trim().min(10).max(15),
	password: z.string().trim().min(8).max(128)
});

export class LoginRequestDto extends createZodDto(LoginSchema) {}
