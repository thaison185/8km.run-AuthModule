import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const GoogleTokenSchema = z.object({
	idToken: z.string().min(1, "idToken is required")
});

export class GoogleTokenDto extends createZodDto(GoogleTokenSchema) {}
