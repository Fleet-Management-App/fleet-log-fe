import { type FC, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getGetTripQueryKey,
  getListTripsQueryKey,
  useLogOdometer,
} from "@/api/generated/hooks/trips/trips";
import { type TripOdometerRequest, TripStatus } from "@/api/generated/models";
import { formatNumber } from "@/modules/common/utils/formatDate";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { LogTripNotice } from "../components/LogTripNotice";
import { OdometerForm } from "../forms/OdometerForm/OdometerForm";
import { LogTripDataContainer } from "./LogTripDataContainer";

export const LogOdometerContainer: FC<{ tripId: string }> = ({ tripId }) => {
  const { t } = useTranslation(["tripLog", "common"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: logOdometer } = useLogOdometer();
  const [serverError, setServerError] = useState<string>();
  // Once saved, the cached trip turns COMPLETED; keep showing the form until we have navigated away
  const [isSaved, setIsSaved] = useState(false);

  // Logging the odometer completes the trip (BR-05); fuel is a separate, optional step (BR-06)
  const handleSubmit = async (data: TripOdometerRequest) => {
    setServerError(undefined);
    try {
      const trip = await logOdometer({ tripId, data });
      setIsSaved(true);
      queryClient.setQueryData(getGetTripQueryKey(tripId), trip);
      await queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
      toast.success(t("odometer.success"));
      await navigate({ to: "/trips/$tripId", params: { tripId } });
    } catch (error) {
      // Includes the BE's 400 for BR-04 and 409 when the plan is no longer approved (BR-03)
      setServerError(getErrorMessage(error, t("common:states.actionError")));
    }
  };

  return (
    <LogTripDataContainer tripId={tripId}>
      {(trip, vehicle) => {
        if (trip.status === TripStatus.COMPLETED && !isSaved) {
          return (
            <LogTripNotice title={t("odometer.alreadyCompleted.title")}>
              {t("odometer.alreadyCompleted.text", {
                start: formatNumber(trip.odometerStartKm ?? 0),
                end: formatNumber(trip.odometerEndKm ?? 0),
              })}
            </LogTripNotice>
          );
        }
        // BR-03: the odometer can be logged only once the plan is approved
        if (trip.status !== TripStatus.PLAN_APPROVED && !isSaved) {
          return (
            <LogTripNotice variant="warning" title={t("odometer.notApproved.title")}>
              {t("odometer.notApproved.text")}
            </LogTripNotice>
          );
        }
        return (
          <OdometerForm
            lastKnownOdometerKm={vehicle?.odometerKm}
            serverError={serverError}
            onSubmit={handleSubmit}
          />
        );
      }}
    </LogTripDataContainer>
  );
};
