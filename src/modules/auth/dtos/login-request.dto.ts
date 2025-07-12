import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const schema = z.object({
	username: z.string().trim().min(3).max(20),
	password: z.string().trim().min(8).max(128)
});

export class LoginRequestDto extends createZodDto(schema) {}
