import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const VerifyEmailOtpSchema = z.object({
	email: z.string().email("Invalid email format"),
	otp: z.string().length(6, "OTP must be 6 digits")
});

export class VerifyEmailOtpDto extends createZodDto(VerifyEmailOtpSchema) {}
