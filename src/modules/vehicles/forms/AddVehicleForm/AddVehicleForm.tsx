import { type FC, useMemo } from "react";

import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { type VehicleCreateRequest, VehicleFuelType } from "@/api/generated/models";
import { useAppForm } from "@/modules/common/components/form/useAppForm";
import { Button } from "@/modules/common/components/ui/button";
import { DialogClose, DialogFooter } from "@/modules/common/components/ui/dialog";
import { FieldGroup } from "@/modules/common/components/ui/field";

// Fields the BE can reject as already taken in the organization (409)
export type UniqueVehicleField = "plate" | "vin";

export type AddVehicleSubmitResult =
  { success: true } | { success: false; fieldErrors?: Partial<Record<UniqueVehicleField, string>> };

type AddVehicleFormProps = {
  onSubmit: (values: VehicleCreateRequest) => Promise<AddVehicleSubmitResult>;
};

// Inputs hold strings; the odometer and empty dates are converted when submitting
type AddVehicleFormValues = {
  plate: string;
  vin: string;
  make: string;
  model: string;
  fuelType: VehicleFuelType;
  odometerKm: string;
  stkDueDate: string;
  insuranceDueDate: string;
  vignetteDueDate: string;
};

const addVehicleFormDefaults: AddVehicleFormValues = {
  plate: "",
  vin: "",
  make: "",
  model: "",
  fuelType: VehicleFuelType.PETROL,
  odometerKm: "",
  stkDueDate: "",
  insuranceDueDate: "",
  vignetteDueDate: "",
};

// Limits mirror VehicleCreateRequest on the BE
const createAddVehicleFormSchema = (t: TFunction<"vehicles">) => {
  const requiredText = (max: number) =>
    z.string().trim().min(1, t("form.errors.required")).max(max, t("form.errors.tooLong", { max }));
  const optionalDate = z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, t("form.errors.date"));

  return z.object({
    plate: requiredText(20),
    vin: requiredText(32),
    make: requiredText(100),
    model: requiredText(100),
    fuelType: z.enum(VehicleFuelType),
    // Up to 9 digits keeps the value inside the BE's Int
    odometerKm: z
      .string()
      .trim()
      .min(1, t("form.errors.required"))
      .regex(/^\d{1,9}$/, t("form.errors.odometer")),
    stkDueDate: optionalDate,
    insuranceDueDate: optionalDate,
    vignetteDueDate: optionalDate,
  });
};

// The BE normalises plate and VIN (capitals, spacing) and checks duplicates on the normalised form
const toCreateRequest = (values: AddVehicleFormValues): VehicleCreateRequest => ({
  plate: values.plate.trim(),
  vin: values.vin.trim(),
  make: values.make.trim(),
  model: values.model.trim(),
  fuelType: values.fuelType,
  odometerKm: Number(values.odometerKm.trim()),
  stkDueDate: values.stkDueDate || null,
  insuranceDueDate: values.insuranceDueDate || null,
  vignetteDueDate: values.vignetteDueDate || null,
});

export const AddVehicleForm: FC<AddVehicleFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation("vehicles");
  const { t: tCommon } = useTranslation();
  const schema = useMemo(() => createAddVehicleFormSchema(t), [t]);
  const fuelTypeOptions = useMemo(
    () => Object.values(VehicleFuelType).map((value) => ({ value, label: t(`fuelType.${value}`) })),
    [t],
  );

  const form = useAppForm({
    defaultValues: addVehicleFormDefaults,
    validators: { onChange: schema },
    onSubmit: async ({ value, formApi }) => {
      const result = await onSubmit(toCreateRequest(value));
      if (result.success) return;
      // A server error sits in the field's onSubmit slot, which TanStack Form clears on the next edit
      Object.entries(result.fieldErrors ?? {}).forEach(([name, message]) =>
        formApi.setFieldMeta(name as UniqueVehicleField, (meta) => ({
          ...meta,
          isTouched: true,
          errorMap: { ...meta.errorMap, onSubmit: { message } },
        })),
      );
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
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="plate">
          {(field) => (
            <field.TextField label={t("form.plate")} placeholder="1AB 2345" autoComplete="off" />
          )}
        </form.AppField>
        <form.AppField name="vin">
          {(field) => (
            <field.TextField
              label={t("form.vin")}
              placeholder="TMBJJ7NE5L0123456"
              autoComplete="off"
            />
          )}
        </form.AppField>
        <form.AppField name="make">
          {(field) => <field.TextField label={t("form.make")} placeholder="Škoda" />}
        </form.AppField>
        <form.AppField name="model">
          {(field) => <field.TextField label={t("form.model")} placeholder="Octavia" />}
        </form.AppField>
        <form.AppField name="fuelType">
          {(field) => <field.SelectField label={t("form.fuelType")} options={fuelTypeOptions} />}
        </form.AppField>
        <form.AppField name="odometerKm">
          {(field) => (
            <field.TextField label={t("form.odometer")} inputMode="numeric" placeholder="0" />
          )}
        </form.AppField>
        <form.AppField name="stkDueDate">
          {(field) => <field.TextField label={t("form.stkDueDate")} type="date" />}
        </form.AppField>
        <form.AppField name="insuranceDueDate">
          {(field) => <field.TextField label={t("form.insuranceDueDate")} type="date" />}
        </form.AppField>
        <form.AppField name="vignetteDueDate">
          {(field) => <field.TextField label={t("form.vignetteDueDate")} type="date" />}
        </form.AppField>
      </FieldGroup>
      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {tCommon("actions.cancel")}
          </Button>
        </DialogClose>
        <form.AppForm>
          <form.SubmitButton>{t("form.submit")}</form.SubmitButton>
        </form.AppForm>
      </DialogFooter>
    </form>
  );
};
