import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const FirebaseOTPSchema = z.object({
	phone: z.string().trim().min(10).max(15),
	recaptchaToken: z.string().trim()
});

export class FirebaseOTPDto extends createZodDto(FirebaseOTPSchema) {}
