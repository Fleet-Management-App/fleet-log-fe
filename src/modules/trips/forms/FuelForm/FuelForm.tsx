import type { FC } from "react";

import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { TripFuelRequest } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";

import { parseNumberInput } from "../OdometerForm/parseNumberInput";
import { PendingSubmitButton } from "../OdometerForm/PendingSubmitButton";
import { ServerErrorAlert } from "../OdometerForm/ServerErrorAlert";
import { UnitField } from "../OdometerForm/UnitField";
import { createFuelFormSchema, type FuelFormValues } from "./fuelFormSchema";
import { ReceiptPhotoField } from "./ReceiptPhotoField";

type FuelFormProps = {
  // Prefilled with the rejected entry when it is being resubmitted (BR-07)
  defaultValues: FuelFormValues;
  isResubmit?: boolean;
  serverError?: string;
  onSubmit: (values: TripFuelRequest) => Promise<void>;
};

export const FuelForm: FC<FuelFormProps> = ({
  defaultValues,
  isResubmit,
  serverError,
  onSubmit,
}) => {
  const { t } = useTranslation("tripLog");

  const form = useAppForm({
    defaultValues,
    validators: { onChange: createFuelFormSchema(t) },
    onSubmit: ({ value }) =>
      onSubmit({
        liters: parseNumberInput(value.liters),
        price: parseNumberInput(value.price),
        receiptPhoto: value.receiptPhoto?.dataUrl ?? null,
      }),
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
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="liters">
            {() => (
              <UnitField
                label={t("fuel.litersLabel")}
                unit={t("units.liters")}
                inputMode="decimal"
                placeholder={t("fuel.litersPlaceholder")}
              />
            )}
          </form.AppField>
          <form.AppField name="price">
            {() => (
              <UnitField
                label={t("fuel.priceLabel")}
                unit={t("units.currency")}
                inputMode="decimal"
                placeholder={t("fuel.pricePlaceholder")}
              />
            )}
          </form.AppField>
        </div>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <form.AppField name="receiptPhoto">
              {() => <ReceiptPhotoField disabled={isSubmitting} />}
            </form.AppField>
          )}
        </form.Subscribe>
        {/* BR-06: fuel is optional and never changes or blocks the trip's COMPLETED status */}
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {t("fuel.optionalNote")}
        </p>
        <ServerErrorAlert title={t("fuel.saveErrorTitle")} message={serverError} />
        <form.AppForm>
          <PendingSubmitButton
            label={isResubmit ? t("fuel.resubmit") : t("fuel.submit")}
            pendingLabel={t("fuel.submitting")}
          />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
