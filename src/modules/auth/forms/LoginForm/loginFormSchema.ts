import { z } from "zod";

import type { LoginRequest } from "@/api/generated/models";

export const loginFormSchema = z.object({
  email: z.email("Enter a valid e-mail"),
  password: z.string().min(1, "Enter your password"),
});

export const loginFormDefaults: LoginRequest = { email: "", password: "" };
