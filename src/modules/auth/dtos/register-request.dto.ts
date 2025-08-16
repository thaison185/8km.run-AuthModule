import { createZodDto } from "nestjs-zod";
import { genderSchema } from "src/common/enums";
import { z } from "zod";

const RegisterSchema = z.object({
	password: z.string().trim().min(8).max(128),
	email: z.string().email().trim().max(50),
	phone: z.string().trim().min(10).max(15),
	firstname: z.string().trim().min(1).max(50),
	lastname: z.string().trim().min(1).max(50),
	dob: z.string().date().optional(),
	gender: genderSchema.optional(),
	is_pic: z.boolean().optional(),
	qrCode: z.string().trim().max(100).optional()
});

export class RegisterRequestDto extends createZodDto(RegisterSchema) {}
