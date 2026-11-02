import type { FC } from "react";

import { z } from "zod";

import type { CreateOrganizationRequest } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";

const createOrganizationFormSchema = z.object({
  name: z.string().trim().min(1, "Enter the organization's name").max(200),
});

export const CreateOrganizationForm: FC<{
  onSubmit: (values: CreateOrganizationRequest) => Promise<unknown>;
}> = ({ onSubmit }) => {
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
            <field.TextField label="Organization name" placeholder="e.g. Demo Fleet s.r.o." />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton>Create organization</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
