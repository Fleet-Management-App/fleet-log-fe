import type { FC, ReactNode } from "react";

import { useTranslation } from "react-i18next";

import { useGetTrip } from "@/api/generated/hooks/trips/trips";
import { useListVehicles } from "@/api/generated/hooks/vehicles/vehicles";
import type { TripResponse, VehicleResponse } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import { Skeleton } from "@/modules/common/components/ui/skeleton";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { LogTripNotice } from "../components/LogTripNotice";
import { LogTripSummary } from "../components/LogTripSummary";

type LogTripDataContainerProps = {
  tripId: string;
  children: (trip: TripResponse, vehicle: VehicleResponse | undefined) => ReactNode;
};

// Loads the trip and its vehicle for the odometer/fuel screens and renders the trip summary;
// the children decide between the form and a message from the loaded trip's state.
export const LogTripDataContainer: FC<LogTripDataContainerProps> = ({ tripId, children }) => {
  const { t } = useTranslation(["tripLog", "common"]);
  const tripQuery = useGetTrip(tripId);
  // The trip carries only the vehicle id; the pool list gives its name, plate and odometer
  const vehiclesQuery = useListVehicles();

  if (tripQuery.isPending || vehiclesQuery.isPending) {
    return (
      <div className="flex flex-col gap-5" aria-busy>
        <Skeleton className="h-14 w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (tripQuery.isError) {
    return (
      <LogTripNotice
        variant="destructive"
        title={t("loadError")}
        action={
          <Button variant="outline" size="sm" onClick={() => void tripQuery.refetch()}>
            {t("common:actions.retry")}
          </Button>
        }
      >
        {getErrorMessage(tripQuery.error, t("common:states.loadError"))}
      </LogTripNotice>
    );
  }

  const trip = tripQuery.data;
  // A failed vehicle list only costs the summary its vehicle line and the odometer hint
  const vehicle = vehiclesQuery.data?.find((item) => item.id === trip.vehicleId);

  return (
    <>
      <LogTripSummary trip={trip} vehicle={vehicle} />
      {children(trip, vehicle)}
    </>
  );
};
