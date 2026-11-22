import { type FC, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getGetTripQueryKey,
  getListTripsQueryKey,
  useLogFuel,
} from "@/api/generated/hooks/trips/trips";
import {
  FuelStatus,
  type TripFuelRequest,
  type TripResponse,
  TripStatus,
} from "@/api/generated/models";
import { formatNumber, formatPrice } from "@/modules/common/utils/formatDate";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { LogTripNotice } from "../components/LogTripNotice";
import { FuelForm } from "../forms/FuelForm/FuelForm";
import type { FuelFormValues } from "../forms/FuelForm/fuelFormSchema";
import { LogTripDataContainer } from "./LogTripDataContainer";

// The API takes fuel on a trip in any status; the FE offers it only once the plan is approved,
// i.e. on the trip being driven or already completed (a fill-up belongs to a trip that happens).
const FUEL_TRIP_STATUSES: TripStatus[] = [TripStatus.PLAN_APPROVED, TripStatus.COMPLETED];

const EMPTY_FUEL_FORM: FuelFormValues = { liters: "", price: "", receiptPhoto: null };

export const LogFuelContainer: FC<{ tripId: string }> = ({ tripId }) => {
  const { t } = useTranslation(["tripLog", "common"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: logFuel } = useLogFuel();
  const [serverError, setServerError] = useState<string>();
  // Once sent, the cached entry turns PENDING; keep showing the form until we have navigated away
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (data: TripFuelRequest) => {
    setServerError(undefined);
    try {
      const trip = await logFuel({ tripId, data });
      setIsSaved(true);
      queryClient.setQueryData(getGetTripQueryKey(tripId), trip);
      await queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
      toast.success(t("fuel.success"));
      await navigate({ to: "/trips/$tripId", params: { tripId } });
    } catch (error) {
      // Includes the BE's 409 when an entry is already pending or approved
      setServerError(getErrorMessage(error, t("common:states.actionError")));
    }
  };

  // A rejected entry is resubmitted through the same form, prefilled with what was sent (BR-07)
  const getDefaultValues = (trip: TripResponse): FuelFormValues =>
    trip.fuel?.status === FuelStatus.REJECTED
      ? {
          liters: formatNumber(trip.fuel.liters, 3),
          price: formatNumber(trip.fuel.price),
          receiptPhoto: trip.fuel.receiptPhotoUrl
            ? { dataUrl: trip.fuel.receiptPhotoUrl, name: t("receipt.label") }
            : null,
        }
      : EMPTY_FUEL_FORM;

  return (
    <LogTripDataContainer tripId={tripId}>
      {(trip) => {
        const fuel = trip.fuel;
        if (!isSaved) {
          if (!FUEL_TRIP_STATUSES.includes(trip.status)) {
            return (
              <LogTripNotice variant="warning" title={t("fuel.notAvailable.title")}>
                {t("fuel.notAvailable.text")}
              </LogTripNotice>
            );
          }
          // BR-07: only a rejected entry can be resubmitted; a pending or approved one stays as it is
          if (fuel?.status === FuelStatus.PENDING || fuel?.status === FuelStatus.APPROVED) {
            const key = fuel.status === FuelStatus.PENDING ? "pending" : "approved";
            return (
              <LogTripNotice title={t(`fuel.${key}.title`)}>
                <span>
                  {t("fuel.summary", {
                    liters: formatNumber(fuel.liters),
                    price: formatPrice(fuel.price),
                  })}
                </span>
                <span>{t(`fuel.${key}.text`)}</span>
              </LogTripNotice>
            );
          }
        }

        const isResubmit = fuel?.status === FuelStatus.REJECTED;
        return (
          <>
            {isResubmit && !isSaved && (
              <LogTripNotice variant="destructive" title={t("fuel.rejected.title")}>
                <span className="break-words">
                  {fuel.rejectionReason || t("fuel.rejected.noReason")}
                </span>
                <span>{t("fuel.rejected.hint")}</span>
              </LogTripNotice>
            )}
            <FuelForm
              defaultValues={getDefaultValues(trip)}
              isResubmit={isResubmit}
              serverError={serverError}
              onSubmit={handleSubmit}
            />
          </>
        );
      }}
    </LogTripDataContainer>
  );
};
