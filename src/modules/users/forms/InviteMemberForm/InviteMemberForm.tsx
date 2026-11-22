import type { FC } from "react";

import { z } from "zod";

import { type CreateInvitationRequest, Role } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";
import { ROLE_OPTIONS } from "@/modules/common/utils/roles";

const inviteMemberFormSchema = z.object({
  email: z.email("Enter a valid e-mail").max(320),
  roles: z.array(z.enum(Role)).min(1, "Pick at least one role"),
});

const inviteMemberFormDefaults: CreateInvitationRequest = { email: "", roles: [Role.DRIVER] };

type InviteMemberFormProps = {
  // Resolves to true when the invitation was sent, which clears the form
  onSubmit: (values: CreateInvitationRequest) => Promise<boolean>;
};

export const InviteMemberForm: FC<InviteMemberFormProps> = ({ onSubmit }) => {
  const form = useAppForm({
    defaultValues: inviteMemberFormDefaults,
    validators: { onChange: inviteMemberFormSchema },
    onSubmit: async ({ value, formApi }) => {
      if (await onSubmit(value)) formApi.reset();
    },
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
          {(field) => <field.TextField label="E-mail" type="email" placeholder="name@company.cz" />}
        </form.AppField>
        <form.AppField name="roles">
          {(field) => <field.MultiToggleField label="Roles" options={ROLE_OPTIONS} />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton>Send invitation</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
