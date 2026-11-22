import type { FC } from "react";

import { useTranslation } from "react-i18next";

import type { TripOdometerRequest } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";
import { formatNumber } from "@/modules/common/utils/formatDate";

import { createOdometerFormSchema, type OdometerFormValues } from "./odometerFormSchema";
import { parseNumberInput } from "./parseNumberInput";
import { PendingSubmitButton } from "./PendingSubmitButton";
import { ServerErrorAlert } from "./ServerErrorAlert";
import { UnitField } from "./UnitField";

type OdometerFormProps = {
  // The vehicle's last known reading; prefills the start as a hint the driver can overwrite
  lastKnownOdometerKm?: number;
  serverError?: string;
  onSubmit: (values: TripOdometerRequest) => Promise<void>;
};

export const OdometerForm: FC<OdometerFormProps> = ({
  lastKnownOdometerKm,
  serverError,
  onSubmit,
}) => {
  const { t } = useTranslation("tripLog");
  const defaultValues: OdometerFormValues = {
    odometerStartKm: lastKnownOdometerKm === undefined ? "" : String(lastKnownOdometerKm),
    odometerEndKm: "",
  };

  const form = useAppForm({
    defaultValues,
    validators: { onChange: createOdometerFormSchema(t) },
    onSubmit: ({ value }) =>
      onSubmit({
        odometerStartKm: parseNumberInput(value.odometerStartKm),
        odometerEndKm: parseNumberInput(value.odometerEndKm),
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
          <form.AppField name="odometerStartKm">
            {() => (
              <UnitField
                label={t("odometer.startLabel")}
                unit={t("units.km")}
                inputMode="numeric"
                placeholder={t("odometer.startPlaceholder")}
                description={
                  lastKnownOdometerKm === undefined
                    ? undefined
                    : t("odometer.lastKnownHint", { km: formatNumber(lastKnownOdometerKm) })
                }
              />
            )}
          </form.AppField>
          <form.AppField name="odometerEndKm">
            {() => (
              <UnitField
                label={t("odometer.endLabel")}
                unit={t("units.km")}
                inputMode="numeric"
                placeholder={t("odometer.endPlaceholder")}
              />
            )}
          </form.AppField>
        </div>
        <ServerErrorAlert title={t("odometer.saveErrorTitle")} message={serverError} />
        <form.AppForm>
          <PendingSubmitButton
            label={t("odometer.submit")}
            pendingLabel={t("odometer.submitting")}
          />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
};
