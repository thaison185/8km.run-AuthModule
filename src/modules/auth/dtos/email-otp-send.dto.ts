import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const SendEmailOtpSchema = z.object({
	email: z.string().email("Invalid email format"),
	recaptchaToken: z.string().trim()
});

export class SendEmailOtpDto extends createZodDto(SendEmailOtpSchema) {}
