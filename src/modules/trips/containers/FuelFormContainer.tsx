import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { useGetFuelReceipt } from "@/api/generated/hooks/trips/trips";
import { FuelStatus, type TripFuelRequest, type TripResponse } from "@/api/generated/models";
import { Skeleton } from "@/modules/common/components/ui/skeleton";
import { formatNumber } from "@/modules/common/utils/formatDate";

import { FuelForm } from "../forms/FuelForm/FuelForm";
import type { FuelFormValues } from "../forms/FuelForm/fuelFormSchema";

const EMPTY_FUEL_FORM: FuelFormValues = { liters: "", price: "", receiptPhoto: null };

type FuelFormContainerProps = {
  trip: TripResponse;
  onSubmit: (values: TripFuelRequest) => Promise<void>;
};

// The fuel form, prefilled with what was sent when a rejected entry is resubmitted (BR-07).
// The trip carries only whether the entry has a receipt; the photo itself is loaded separately.
export const FuelFormContainer: FC<FuelFormContainerProps> = ({ trip, onSubmit }) => {
  const { t } = useTranslation("tripLog");
  const fuel = trip.fuel?.status === FuelStatus.REJECTED ? trip.fuel : undefined;
  const receiptQuery = useGetFuelReceipt(trip.id, {
    query: { enabled: fuel?.hasReceipt === true },
  });

  // The form takes its values once, so it waits for the photo rather than filling it in later
  if (receiptQuery.isLoading) {
    return <Skeleton className="h-40 w-full" aria-busy />;
  }

  // A photo that failed to load is left empty; the form then asks the driver to pick it again
  const receiptPhoto = receiptQuery.data?.receiptPhoto;
  const defaultValues: FuelFormValues = fuel
    ? {
        liters: formatNumber(fuel.liters, 3),
        price: formatNumber(fuel.price),
        receiptPhoto: receiptPhoto ? { dataUrl: receiptPhoto, name: t("receipt.label") } : null,
      }
    : EMPTY_FUEL_FORM;

  return <FuelForm defaultValues={defaultValues} isResubmit={!!fuel} onSubmit={onSubmit} />;
};
