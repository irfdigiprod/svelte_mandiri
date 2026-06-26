import { z } from "zod";
import { registerSchema } from "../schemas/auth.schema";

export type RegisterRequest = z.infer<typeof registerSchema>;
