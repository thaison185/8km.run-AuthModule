import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const FirebaseVerifyOTPSchema = z.object({
	phone: z.string().trim().min(10).max(15),
	otp: z.string(),
	sessionInfo: z.string()
});

export class FirebaseVerifyOTPDto extends createZodDto(FirebaseVerifyOTPSchema) {}
