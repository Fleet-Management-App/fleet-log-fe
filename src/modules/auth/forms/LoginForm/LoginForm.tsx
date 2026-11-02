import type { FC } from "react";

import type { LoginRequest } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";

import { loginFormDefaults, loginFormSchema } from "./loginFormSchema";

export const LoginForm: FC<{ onSubmit: (values: LoginRequest) => Promise<unknown> }> = ({
  onSubmit,
}) => {
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
          {(field) => <field.TextField label="E-mail" type="email" autoComplete="email" />}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField label="Password" type="password" autoComplete="current-password" />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton>Log in</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
