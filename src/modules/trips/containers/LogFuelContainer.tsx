import { type FC, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getGetFuelReceiptQueryKey,
  getGetTripQueryKey,
  getListTripsQueryKey,
  useLogFuel,
} from "@/api/generated/hooks/trips/trips";
import { FuelStatus, type TripFuelRequest, TripStatus } from "@/api/generated/models";
import { formatNumber, formatPrice } from "@/modules/common/utils/formatDate";

import { LogTripNotice } from "../components/LogTripNotice";
import { FuelFormContainer } from "./FuelFormContainer";
import { LogTripDataContainer } from "./LogTripDataContainer";

// Fuel belongs to a trip that happens: the one being driven or already completed (the BE answers
// 409 TRIP_NOT_PLAN_APPROVED otherwise)
const FUEL_TRIP_STATUSES: TripStatus[] = [TripStatus.PLAN_APPROVED, TripStatus.COMPLETED];

export const LogFuelContainer: FC<{ tripId: string }> = ({ tripId }) => {
  const { t } = useTranslation("tripLog");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: logFuel } = useLogFuel();
  // Once sent, the cached entry turns PENDING; keep showing the form until we have navigated away
  const [isSaved, setIsSaved] = useState(false);

  // A failed send rejects, and the form shows the BE's error
  const handleSubmit = async (data: TripFuelRequest) => {
    const trip = await logFuel({ tripId, data });
    setIsSaved(true);
    queryClient.setQueryData(getGetTripQueryKey(tripId), trip);
    // A cached photo of the earlier, rejected entry must not be offered again
    queryClient.removeQueries({ queryKey: getGetFuelReceiptQueryKey(tripId) });
    await queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
    toast.success(t("fuel.success"));
    await navigate({ to: "/trips/$tripId", params: { tripId } });
  };

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
            <FuelFormContainer trip={trip} onSubmit={handleSubmit} />
          </>
        );
      }}
    </LogTripDataContainer>
  );
};
