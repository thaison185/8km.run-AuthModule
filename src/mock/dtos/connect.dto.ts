import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const schema = z.object({ userId: z.string(), qrCode: z.string() });

export class ConnectDevice extends createZodDto(schema) {}
