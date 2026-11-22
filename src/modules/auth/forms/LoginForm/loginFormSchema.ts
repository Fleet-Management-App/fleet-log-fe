import { z } from "zod";

import type { LoginRequest } from "@/api/generated/models";
import { translationKey } from "@/modules/common/utils/translationKey";

// Messages are translation keys, translated when shown (FormFieldError)
export const loginFormSchema = z.object({
  email: z.email(translationKey("common:validation.email")),
  password: z.string().min(1, translationKey("auth:validation.passwordRequired")),
});

export const loginFormDefaults: LoginRequest = { email: "", password: "" };
