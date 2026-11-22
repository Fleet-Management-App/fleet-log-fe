import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { useFieldContext } from "@/modules/common/components/form/formContext";
import { Field, FieldError, FieldLabel } from "@/modules/common/components/ui/field";
import { ReceiptPhotoInput } from "@/modules/fuel/components/ReceiptPhotoInput";
import type { ReceiptPhoto } from "@/modules/fuel/models/receiptPhoto";

// Binds the receipt photo picker to the form; used inside `form.AppField`
export const ReceiptPhotoField: FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { t } = useTranslation("tripLog");
  const field = useFieldContext<ReceiptPhoto | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className="text-xs font-semibold tracking-wide uppercase">
        {t("receipt.label")}
      </FieldLabel>
      <ReceiptPhotoInput
        id={field.name}
        value={field.state.value}
        isInvalid={isInvalid}
        disabled={disabled}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
};
