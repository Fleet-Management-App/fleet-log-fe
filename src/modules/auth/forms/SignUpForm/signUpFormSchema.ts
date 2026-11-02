import { z } from "zod";

import type { SignUpRequest } from "@/api/generated/models";

// Mirrors the BE validation on SignUpRequest
export const signUpFormSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name").max(200),
  email: z.email("Enter a valid e-mail").max(320),
  password: z.string().min(8, "At least 8 characters").max(100),
});

export const signUpFormDefaults: SignUpRequest = { fullName: "", email: "", password: "" };
