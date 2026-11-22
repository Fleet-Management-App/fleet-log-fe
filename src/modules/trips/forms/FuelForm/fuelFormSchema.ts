import type { TFunction } from "i18next";

import { z } from "zod";

import type { ReceiptPhoto } from "@/modules/fuel/models/receiptPhoto";

import { isDecimalNumberInput, parseNumberInput } from "../OdometerForm/parseNumberInput";

export type FuelFormValues = {
  liters: string;
  price: string;
  receiptPhoto: ReceiptPhoto | null;
};

const positiveDecimal = (requiredMessage: string, positiveMessage: string) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .refine((value) => isDecimalNumberInput(value) && parseNumberInput(value) > 0, positiveMessage);

export const createFuelFormSchema = (t: TFunction<"tripLog">) =>
  z.object({
    liters: positiveDecimal(
      t("fuel.validation.litersRequired"),
      t("fuel.validation.litersPositive"),
    ),
    price: positiveDecimal(t("fuel.validation.priceRequired"), t("fuel.validation.pricePositive")),
    // The receipt is what the Fleet Manager approves the fill-up against, so the FE asks for it
    // even though the API accepts an entry without one
    receiptPhoto: z.custom<ReceiptPhoto | null>(
      (value) => value !== null,
      t("fuel.validation.receiptRequired"),
    ),
  });
