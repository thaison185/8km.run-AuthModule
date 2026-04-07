import { z } from "zod";

export const idBodyField = z.number().min(0).int();
