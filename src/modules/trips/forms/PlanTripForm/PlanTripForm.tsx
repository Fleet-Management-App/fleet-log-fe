import { type FC, type ReactNode, useMemo, useState } from "react";

import { useStore } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";

import type { TripCreateRequest, VehicleResponse } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { Button } from "@/modules/common/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/modules/common/components/ui/field";
import { formatDate } from "@/modules/common/utils/formatDate";
import { getErrorField, getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { PlanTripNotice } from "../../components/PlanTripNotice";
import { VehiclePicker } from "../../components/VehiclePicker";
import { getVehicleAvailability } from "../../utils/vehicleAvailability";
import {
  createPlanTripFormSchema,
  type PlanTripFormValues,
  toTripCreateRequest,
} from "./planTripFormValues";

type PlanTripFormProps = {
  vehicles: VehicleResponse[];
  defaultValues: PlanTripFormValues;
  submitLabel: string;
  // The error of the last failed submit; shown on the vehicle field when the BE says it is about
  // the vehicle (BR-01), otherwise above the buttons
  submitError?: unknown;
  // Shown above the fields, e.g. why the plan was rejected
  notice?: ReactNode;
  onSubmit: (request: TripCreateRequest) => Promise<void>;
  onCancel: () => void;
};

// Figma labels are small caps above each field
const LABEL_CLASSES =
  "**:data-[slot=field-label]:text-xs **:data-[slot=field-label]:font-semibold **:data-[slot=field-label]:tracking-wide **:data-[slot=field-label]:uppercase";

export const PlanTripForm: FC<PlanTripFormProps> = ({
  vehicles,
  defaultValues,
  submitLabel,
  submitError,
  notice,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation(["tripPlan", "common"]);
  // The vehicle the last submit was sent with, so a BE error about it is not left on another one
  const [submittedVehicleId, setSubmittedVehicleId] = useState<string>();

  // Only the BR-01 block matters for validation, and it does not depend on the trip's date
  const schema = useMemo(
    () =>
      createPlanTripFormSchema(
        t,
        vehicles.map((vehicle) => getVehicleAvailability(vehicle, "")),
      ),
    [t, vehicles],
  );

  const form = useAppForm({
    defaultValues,
    validators: { onChange: schema },
    onSubmit: ({ value }) => {
      setSubmittedVehicleId(value.vehicleId);
      return onSubmit(toTripCreateRequest(value));
    },
  });

  const date = useStore(form.store, (state) => state.values.date);
  const vehicleId = useStore(form.store, (state) => state.values.vehicleId);

  // The vignette is judged at the trip's date (BR-02), so the rows refresh when the date changes
  const availability = useMemo(
    () => vehicles.map((vehicle) => getVehicleAvailability(vehicle, date)),
    [vehicles, date],
  );
  const selected = availability.find((item) => item.vehicle.id === vehicleId);
  const vignetteDate = selected?.vehicle.vignetteDueDate
    ? formatDate(`${selected.vehicle.vignetteDueDate}T00:00`)
    : "";

  const isVehicleSubmitError = !!submitError && getErrorField(submitError) === "vehicleId";
  const vehicleSubmitError =
    isVehicleSubmitError && vehicleId === submittedVehicleId
      ? { message: getErrorMessage(submitError) }
      : undefined;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup className={LABEL_CLASSES}>
        {notice}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-3">
          <form.AppField name="date">
            {(field) => <field.TextField label={t("fields.date")} type="date" />}
          </form.AppField>
          <form.AppField name="time">
            {(field) => <field.TextField label={t("fields.time")} type="time" />}
          </form.AppField>
        </div>

        <form.AppField name="vehicleId">
          {(field) => {
            // An edited plan may come prefilled with a vehicle blocked since (BR-01): say so
            // straight away instead of waiting for the field to be touched
            const blockedError = selected?.blockReason && {
              message: t("validation.vehicleBlocked", {
                reason: t(`vehiclePicker.blockReason.${selected.blockReason}`),
              }),
            };
            const vehicleError = blockedError || vehicleSubmitError;
            const isInvalid =
              !!vehicleError || (field.state.meta.isTouched && !field.state.meta.isValid);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t("fields.vehicle")}</FieldLabel>
                <VehiclePicker
                  id={field.name}
                  vehicles={availability}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  disabled={!date}
                  invalid={isInvalid}
                />
                {isInvalid && (
                  <FieldError errors={vehicleError ? [vehicleError] : field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.AppField>

        {/* BR-02: only the vignette warns the driver; an expired one does not block the plan */}
        {!selected?.blockReason && selected?.vignetteState === "EXPIRING" && (
          <PlanTripNotice variant="warning" title={t("vignette.expiringTitle")}>
            {t("vignette.expiringText", { date: vignetteDate })}
          </PlanTripNotice>
        )}
        {!selected?.blockReason && selected?.vignetteState === "EXPIRED" && (
          <PlanTripNotice variant="error" title={t("vignette.expiredTitle")}>
            {t("vignette.expiredText", { date: vignetteDate })}
          </PlanTripNotice>
        )}

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-3">
          <form.AppField name="fromLocation">
            {(field) => (
              <field.TextField
                label={t("fields.from")}
                placeholder={t("fields.fromPlaceholder")}
                maxLength={200}
              />
            )}
          </form.AppField>
          <form.AppField name="toLocation">
            {(field) => (
              <field.TextField
                label={t("fields.to")}
                placeholder={t("fields.toPlaceholder")}
                maxLength={200}
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="purpose">
          {(field) => (
            <field.TextField
              label={t("fields.purpose")}
              placeholder={t("fields.purposePlaceholder")}
              maxLength={500}
            />
          )}
        </form.AppField>

        {!!submitError && !isVehicleSubmitError && (
          <PlanTripNotice variant="error" title={t("states.submitErrorTitle")}>
            {getErrorMessage(submitError)}
          </PlanTripNotice>
        )}

        <div className="flex flex-col items-center gap-2 *:data-[slot=button]:w-full">
          <form.AppForm>
            <form.SubmitButton>{submitLabel}</form.SubmitButton>
          </form.AppForm>
          <Button type="button" variant="link" onClick={onCancel}>
            {t("common:actions.cancel")}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};
