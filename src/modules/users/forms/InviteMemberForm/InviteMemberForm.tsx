import type { FC } from "react";

import { useTranslation } from "react-i18next";
import { z } from "zod";

import { type CreateInvitationRequest, Role } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";
import { useRoleLabels } from "@/modules/common/utils/roles";
import { translationKey } from "@/modules/common/utils/translationKey";

// Messages are translation keys, translated when shown (FormFieldError)
const inviteMemberFormSchema = z.object({
  email: z
    .email(translationKey("common:validation.email"))
    .max(320, translationKey("common:validation.tooLong")),
  roles: z.array(z.enum(Role)).min(1, translationKey("users:invite.rolesRequired")),
});

const inviteMemberFormDefaults: CreateInvitationRequest = { email: "", roles: [Role.DRIVER] };

type InviteMemberFormProps = {
  // Resolves to true when the invitation was sent, which clears the form
  onSubmit: (values: CreateInvitationRequest) => Promise<boolean>;
};

export const InviteMemberForm: FC<InviteMemberFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation(["users", "common"]);
  const { roleOptions } = useRoleLabels();
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
          {(field) => (
            <field.TextField
              label={t("common:fields.email")}
              type="email"
              placeholder={t("invite.emailPlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppField name="roles">
          {(field) => <field.MultiToggleField label={t("invite.roles")} options={roleOptions} />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton>{t("invite.submit")}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
