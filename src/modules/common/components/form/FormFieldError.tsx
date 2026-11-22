import type { ComponentProps, FC } from "react";

import { useTranslation } from "react-i18next";

import { FieldError } from "@/modules/common/components/ui/field";

type FormFieldErrorProps = { errors: unknown[] };

// Zod schemas are module-level constants and can't call useTranslation, so their messages are
// translation keys (written with translationKey) and get translated here, at render time, which
// also follows a language switch. A message that isn't a key (e.g. zod's own default) shows as is.
export const FormFieldError: FC<FormFieldErrorProps> = ({ errors }) => {
  const { t, i18n } = useTranslation();
  // The key's type was checked where the schema was written; here it is only a string
  const translate = t as (key: string) => string;

  const messages: ComponentProps<typeof FieldError>["errors"] = errors.map((error) => {
    const message = (error as { message?: string } | undefined)?.message;
    return { message: message && i18n.exists(message) ? translate(message) : message };
  });

  return <FieldError errors={messages} />;
};
