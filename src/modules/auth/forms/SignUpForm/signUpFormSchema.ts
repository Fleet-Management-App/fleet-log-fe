import { z } from "zod";

import type { SignUpRequest } from "@/api/generated/models";
import { translationKey } from "@/modules/common/utils/translationKey";

const tooLong = translationKey("common:validation.tooLong");

// Mirrors the BE validation on SignUpRequest. Messages are translation keys, translated when
// shown (FormFieldError).
export const signUpFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, translationKey("auth:validation.fullNameRequired"))
    .max(200, tooLong),
  email: z.email(translationKey("common:validation.email")).max(320, tooLong),
  password: z.string().min(8, translationKey("auth:validation.passwordTooShort")).max(100, tooLong),
});

export const signUpFormDefaults: SignUpRequest = { fullName: "", email: "", password: "" };
