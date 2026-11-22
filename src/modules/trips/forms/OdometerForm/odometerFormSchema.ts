import type { TFunction } from "i18next";

import { z } from "zod";

import { isWholeNumberInput, parseNumberInput } from "./parseNumberInput";

export type OdometerFormValues = {
  odometerStartKm: string;
  odometerEndKm: string;
};

export const createOdometerFormSchema = (t: TFunction<"tripLog">) => {
  const kmReading = z
    .string()
    .trim()
    .min(1, t("odometer.validation.required"))
    .refine(isWholeNumberInput, t("odometer.validation.wholeNumber"));

  return z.object({ odometerStartKm: kmReading, odometerEndKm: kmReading }).refine(
    // BR-04: the end reading must not be below the start reading
    (values) => parseNumberInput(values.odometerEndKm) >= parseNumberInput(values.odometerStartKm),
    { path: ["odometerEndKm"], message: t("odometer.validation.endBelowStart") },
  );
};
