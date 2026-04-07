import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const GoogleTokenSchema = z.object({
	authCode: z.string().min(1, "authCode is required")
});

export class GoogleTokenDto extends createZodDto(GoogleTokenSchema) {}
