import type { FC } from "react";

import type { SignUpRequest } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";

import { signUpFormDefaults, signUpFormSchema } from "./signUpFormSchema";

export const SignUpForm: FC<{ onSubmit: (values: SignUpRequest) => Promise<unknown> }> = ({
  onSubmit,
}) => {
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
          {(field) => <field.TextField label="Full name" autoComplete="name" />}
        </form.AppField>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="E-mail"
              type="email"
              autoComplete="email"
              description="Use the address your organization invited, if you have an invitation."
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              description="At least 8 characters."
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton>Create account</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
