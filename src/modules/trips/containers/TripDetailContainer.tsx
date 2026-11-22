import type { FC } from "react";

import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { CircleAlert, SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getGetTripQueryKey,
  getListTripsQueryKey,
  useCancelTrip,
  useGetTrip,
} from "@/api/generated/hooks/trips/trips";
import { useListVehicles } from "@/api/generated/hooks/vehicles/vehicles";
import { Role } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";
import { hasAnyRole } from "@/security/requireRole";
import { useCurrentUser } from "@/security/useCurrentUser";

import { TripDataCard } from "../components/TripDataCard";
import { TripDetailBanner } from "../components/TripDetailBanner";
import { TripDetailBackLink, TripDetailHeader } from "../components/TripDetailHeader";
import { TripDetailSkeleton } from "../components/TripDetailSkeleton";
import { TripFuelCard } from "../components/TripFuelCard";
import { TripMessageCard } from "../components/TripMessageCard";
import { TripOdometerCard } from "../components/TripOdometerCard";

// 404 = no such trip in this organization, 403 = a driver opening someone else's trip
const NOT_FOUND_STATUSES = [403, 404];

export const TripDetailContainer: FC<{ tripId: string }> = ({ tripId }) => {
  const { t } = useTranslation(["trips", "common"]);
  const me = useCurrentUser();
  const showsAllTrips = hasAnyRole(me, Role.FLEET_MANAGER);
  const queryClient = useQueryClient();

  const tripQuery = useGetTrip(tripId, {
    query: {
      retry: (failureCount, error) =>
        !NOT_FOUND_STATUSES.includes((error as AxiosError)?.response?.status ?? 0) &&
        failureCount < 3,
    },
  });
  const { data: vehicles } = useListVehicles();
  const { mutateAsync: cancelTrip, isPending: isCancelling } = useCancelTrip();

  const handleCancel = async () => {
    try {
      await cancelTrip({ tripId });
      toast.success(t("detail.toast.cancelled"));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(tripId) }),
        queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() }),
      ]);
    } catch (error) {
      toast.error(getErrorMessage(error, t("common:states.actionError")));
    }
  };

  if (tripQuery.isLoading) return <TripDetailSkeleton />;

  if (tripQuery.isError || !tripQuery.data) {
    const isNotFound = NOT_FOUND_STATUSES.includes(
      (tripQuery.error as AxiosError | null)?.response?.status ?? 0,
    );
    return (
      <div className="flex flex-col gap-6">
        <TripDetailBackLink showsAllTrips={showsAllTrips} />
        {isNotFound ? (
          <TripMessageCard
            icon={SearchX}
            title={t("detail.error.notFoundTitle")}
            description={t("detail.error.notFoundDescription")}
          />
        ) : (
          <TripMessageCard
            icon={CircleAlert}
            title={t("detail.error.title")}
            description={t("detail.error.description")}
            action={
              <Button variant="outline" onClick={() => tripQuery.refetch()}>
                {t("common:actions.retry")}
              </Button>
            }
          />
        )}
      </div>
    );
  }

  const trip = tripQuery.data;
  const vehicle = vehicles?.find(({ id }) => id === trip.vehicleId);

  return (
    <div className="flex flex-col gap-6">
      <TripDetailHeader
        trip={trip}
        showsAllTrips={showsAllTrips}
        isCancelling={isCancelling}
        onCancel={handleCancel}
      />
      <TripDetailBanner trip={trip} />
      <div className="grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-6">
          <TripDataCard trip={trip} vehicle={vehicle} showDriver={showsAllTrips} />
          <TripOdometerCard trip={trip} />
        </div>
        <TripFuelCard trip={trip} />
      </div>
    </div>
  );
};
