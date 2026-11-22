import type { FC } from "react";

import { useTranslation } from "react-i18next";

import type { LoginRequest } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";

import { loginFormDefaults, loginFormSchema } from "./loginFormSchema";

export const LoginForm: FC<{ onSubmit: (values: LoginRequest) => Promise<unknown> }> = ({
  onSubmit,
}) => {
  const { t } = useTranslation(["auth", "common"]);
  const form = useAppForm({
    defaultValues: loginFormDefaults,
    validators: { onChange: loginFormSchema },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.TextField label={t("common:fields.email")} type="email" autoComplete="email" />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label={t("fields.password")}
              type="password"
              autoComplete="current-password"
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton>{t("login.submit")}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
