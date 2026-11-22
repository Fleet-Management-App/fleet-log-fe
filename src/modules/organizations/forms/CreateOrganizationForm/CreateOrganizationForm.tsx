import { type FC, useState } from "react";

import { useTranslation } from "react-i18next";
import { z } from "zod";

import type { CreateOrganizationRequest } from "@/api/generated/models";
import { PendingSubmitButton } from "@/modules/common/components/form/PendingSubmitButton";
import { ServerErrorAlert } from "@/modules/common/components/form/ServerErrorAlert";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";
import {
  clearServerFieldErrors,
  setServerFieldError,
} from "@/modules/common/utils/serverFieldError";
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
  // Rejects with the BE's error when creating failed
  onSubmit: (values: CreateOrganizationRequest) => Promise<unknown>;
}> = ({ onSubmit }) => {
  const { t } = useTranslation("organizations");
  // A failure that is not about the name, e.g. the BE being unreachable
  const [serverError, setServerError] = useState<string>();
  const form = useAppForm({
    defaultValues: { name: "" } as CreateOrganizationRequest,
    validators: { onChange: createOrganizationFormSchema },
    listeners: { onChange: ({ formApi }) => clearServerFieldErrors(formApi) },
    onSubmit: async ({ value, formApi }) => {
      setServerError(undefined);
      try {
        await onSubmit(value);
      } catch (error) {
        // An error about the name lands on the field; anything else shows above it
        if (setServerFieldError(formApi, error)) setServerError(t("create.failed"));
      }
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
        <ServerErrorAlert title={t("create.errorTitle")} message={serverError} />
        <form.AppField name="name">
          {(field) => (
            <field.TextField
              label={t("create.nameLabel")}
              placeholder={t("create.namePlaceholder")}
              description={t("create.nameHint")}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <PendingSubmitButton label={t("create.submit")} pendingLabel={t("create.submitting")} />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
