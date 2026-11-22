import type { FC } from "react";

import { useTranslation } from "react-i18next";
import { z } from "zod";

import type { CreateOrganizationRequest } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";
import { translationKey } from "@/modules/common/utils/translationKey";

// Messages are translation keys, translated when shown (FormFieldError)
const createOrganizationFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, translationKey("organizations:create.nameRequired"))
    .max(200, translationKey("common:validation.tooLong")),
});

export const CreateOrganizationForm: FC<{
  onSubmit: (values: CreateOrganizationRequest) => Promise<unknown>;
}> = ({ onSubmit }) => {
  const { t } = useTranslation("organizations");
  const form = useAppForm({
    defaultValues: { name: "" } as CreateOrganizationRequest,
    validators: { onChange: createOrganizationFormSchema },
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
        <form.AppField name="name">
          {(field) => (
            <field.TextField
              label={t("create.nameLabel")}
              placeholder={t("create.namePlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton>{t("create.submit")}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
