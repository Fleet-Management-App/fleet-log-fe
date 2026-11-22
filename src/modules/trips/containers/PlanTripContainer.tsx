import type { FC } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CarIcon, TriangleAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getGetTripQueryKey,
  getListTripsQueryKey,
  useCreateTrip,
} from "@/api/generated/hooks/trips/trips";
import { getListVehiclesQueryKey, useListVehicles } from "@/api/generated/hooks/vehicles/vehicles";
import type { TripCreateRequest } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import { getErrorField, getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { PlanTripCard } from "../components/PlanTripCard";
import { PlanTripMessage } from "../components/PlanTripMessage";
import { PlanTripSkeleton } from "../components/PlanTripSkeleton";
import { PlanTripForm } from "../forms/PlanTripForm/PlanTripForm";
import { planTripFormDefaults } from "../forms/PlanTripForm/planTripFormValues";

export const PlanTripContainer: FC = () => {
  const { t } = useTranslation(["tripPlan", "common"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const vehiclesQuery = useListVehicles();
  const { mutateAsync: createTrip, error: submitError } = useCreateTrip();

  const handleSubmit = async (data: TripCreateRequest) => {
    try {
      const trip = await createTrip({ data });
      // The detail page opens with the new trip already in the cache
      queryClient.setQueryData(getGetTripQueryKey(trip.id), trip);
      await queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
      toast.success(t("plan.success"));
      await navigate({ to: "/trips/$tripId", params: { tripId: trip.id } });
    } catch (error) {
      // The form shows the failure from the mutation's error. A vehicle blocked or deleted since
      // the list loaded (BR-01) refreshes the picker, so it shows why.
      if (getErrorField(error) === "vehicleId")
        void queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
    }
  };

  if (vehiclesQuery.isPending) return <PlanTripSkeleton />;

  if (vehiclesQuery.isError)
    return (
      <PlanTripMessage
        icon={<TriangleAlertIcon />}
        title={t("states.vehiclesLoadError")}
        actions={
          <Button variant="outline" onClick={() => void vehiclesQuery.refetch()}>
            {t("common:actions.retry")}
          </Button>
        }
      >
        {getErrorMessage(vehiclesQuery.error, t("common:states.loadError"))}
      </PlanTripMessage>
    );

  if (vehiclesQuery.data.length === 0)
    return (
      <PlanTripMessage icon={<CarIcon />} title={t("states.noVehiclesTitle")}>
        {t("states.noVehiclesText")}
      </PlanTripMessage>
    );

  return (
    <PlanTripCard>
      <PlanTripForm
        vehicles={vehiclesQuery.data}
        defaultValues={planTripFormDefaults}
        submitLabel={t("plan.submit")}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={() => void navigate({ to: "/trips" })}
      />
    </PlanTripCard>
  );
};
