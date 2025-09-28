import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const SendEmailOtpSchema = z.object({
	email: z.string().email("Invalid email format")
});

export class SendEmailOtpDto extends createZodDto(SendEmailOtpSchema) {}
