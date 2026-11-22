import { type FC, useState } from "react";

import { useTranslation } from "react-i18next";

import type { TripOdometerRequest } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { FieldGroup } from "@/modules/common/components/ui/field";
import { formatNumber } from "@/modules/common/utils/formatDate";
import {
  clearServerFieldErrors,
  setServerFieldError,
} from "@/modules/common/utils/serverFieldError";

import { createOdometerFormSchema, type OdometerFormValues } from "./odometerFormSchema";
import { parseNumberInput } from "./parseNumberInput";
import { PendingSubmitButton } from "./PendingSubmitButton";
import { ServerErrorAlert } from "./ServerErrorAlert";
import { UnitField } from "./UnitField";

type OdometerFormProps = {
  // The vehicle's last known reading; prefills the start as a hint the driver can overwrite
  lastKnownOdometerKm?: number;
  // Rejects with the BE's error when saving failed
  onSubmit: (values: TripOdometerRequest) => Promise<void>;
};

export const OdometerForm: FC<OdometerFormProps> = ({ lastKnownOdometerKm, onSubmit }) => {
  const { t } = useTranslation("tripLog");
  // A BE error that names no field of the form, e.g. 409 TRIP_NOT_PLAN_APPROVED (BR-03)
  const [serverError, setServerError] = useState<string>();
  const defaultValues: OdometerFormValues = {
    odometerStartKm: lastKnownOdometerKm === undefined ? "" : String(lastKnownOdometerKm),
    odometerEndKm: "",
  };

  const form = useAppForm({
    defaultValues,
    validators: { onChange: createOdometerFormSchema(t) },
    listeners: { onChange: ({ formApi }) => clearServerFieldErrors(formApi) },
    onSubmit: async ({ value, formApi }) => {
      setServerError(undefined);
      try {
        await onSubmit({
          odometerStartKm: parseNumberInput(value.odometerStartKm),
          odometerEndKm: parseNumberInput(value.odometerEndKm),
        });
      } catch (error) {
        // A 400 ODOMETER_END_BEFORE_START (BR-04) lands on the end reading
        setServerError(setServerFieldError(formApi, error));
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
