import type { TFunction } from "i18next";

import { z } from "zod";

import type { TripCreateRequest, TripResponse } from "@/api/generated/models";

import {
  toLocalIsoDate,
  type VehicleAvailability,
  type VehicleBlockReason,
} from "../../utils/vehicleAvailability";

// Date and time are separate inputs; they become one instant only when the plan is sent
export type PlanTripFormValues = {
  date: string;
  time: string;
  vehicleId: string;
  fromLocation: string;
  toLocation: string;
  purpose: string;
};

export const planTripFormDefaults: PlanTripFormValues = {
  date: "",
  time: "",
  vehicleId: "",
  fromLocation: "",
  toLocation: "",
  purpose: "",
};

// Length limits mirror the BE's TripCreateRequest
const requiredText = (t: TFunction<"tripPlan">, requiredMessage: string, max: number) =>
  z.string().trim().min(1, requiredMessage).max(max, t("validation.tooLong", { max }));

export const createPlanTripFormSchema = (
  t: TFunction<"tripPlan">,
  vehicles: VehicleAvailability[],
) => {
  const blockReasons = new Map<string, VehicleBlockReason | undefined>(
    vehicles.map(({ vehicle, blockReason }) => [vehicle.id, blockReason]),
  );

  return z.object({
    date: z.string().min(1, t("validation.dateRequired")),
    time: z.string().min(1, t("validation.timeRequired")),
    vehicleId: z
      .string()
      .min(1, t("validation.vehicleRequired"))
      // The picker already disables these, but an edited plan may come prefilled with a vehicle
      // that has been suspended or lost its STK since (BR-01)
      .superRefine((vehicleId, ctx) => {
        const blockReason = blockReasons.get(vehicleId);
        if (blockReason)
          ctx.addIssue({
            code: "custom",
            message: t("validation.vehicleBlocked", {
              reason: t(`vehiclePicker.blockReason.${blockReason}`),
            }),
          });
      }),
    fromLocation: requiredText(t, t("validation.fromRequired"), 200),
    toLocation: requiredText(t, t("validation.toRequired"), 200),
    purpose: requiredText(t, t("validation.purposeRequired"), 500),
  });
};

/** The date and time are read in the user's time zone and sent as an ISO instant. */
export const toTripCreateRequest = (values: PlanTripFormValues): TripCreateRequest => ({
  vehicleId: values.vehicleId,
  dateTime: new Date(`${values.date}T${values.time}`).toISOString(),
  fromLocation: values.fromLocation.trim(),
  toLocation: values.toLocation.trim(),
  purpose: values.purpose.trim(),
});

export const toPlanTripFormValues = (trip: TripResponse): PlanTripFormValues => {
  const dateTime = new Date(trip.dateTime);
  return {
    date: toLocalIsoDate(dateTime),
    time: `${String(dateTime.getHours()).padStart(2, "0")}:${String(dateTime.getMinutes()).padStart(2, "0")}`,
    vehicleId: trip.vehicleId,
    fromLocation: trip.fromLocation,
    toLocation: trip.toLocation,
    purpose: trip.purpose,
  };
};
