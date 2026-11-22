import type { FC } from "react";

import { useTranslation } from "react-i18next";

import type { SignUpRequest } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";

import { signUpFormDefaults, signUpFormSchema } from "./signUpFormSchema";

export const SignUpForm: FC<{ onSubmit: (values: SignUpRequest) => Promise<unknown> }> = ({
  onSubmit,
}) => {
  const { t } = useTranslation(["auth", "common"]);
  const form = useAppForm({
    defaultValues: signUpFormDefaults,
    validators: { onChange: signUpFormSchema },
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
        <form.AppField name="fullName">
          {(field) => <field.TextField label={t("fields.fullName")} autoComplete="name" />}
        </form.AppField>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label={t("common:fields.email")}
              type="email"
              autoComplete="email"
              description={t("signUp.emailDescription")}
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label={t("fields.password")}
              type="password"
              autoComplete="new-password"
              description={t("signUp.passwordDescription")}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton>{t("signUp.submit")}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
