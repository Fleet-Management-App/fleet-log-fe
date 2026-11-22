import type { FC } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { CarIcon, LockIcon, TriangleAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getGetTripQueryKey,
  getListTripsQueryKey,
  useGetTrip,
  useUpdateTripPlan,
} from "@/api/generated/hooks/trips/trips";
import { useListVehicles } from "@/api/generated/hooks/vehicles/vehicles";
import { type TripCreateRequest, TripStatus } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { PlanTripCard } from "../components/PlanTripCard";
import { PlanTripMessage } from "../components/PlanTripMessage";
import { PlanTripNotice } from "../components/PlanTripNotice";
import { PlanTripSkeleton } from "../components/PlanTripSkeleton";
import { TripStatusBadge } from "../components/TripStatusBadge";
import { PlanTripForm } from "../forms/PlanTripForm/PlanTripForm";
import { toPlanTripFormValues } from "../forms/PlanTripForm/planTripFormValues";

// BR-07: a plan-rejected trip is changed and resubmitted through the same form as a new plan
export const EditTripPlanContainer: FC<{ tripId: string }> = ({ tripId }) => {
  const { t } = useTranslation(["tripPlan", "common"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tripQuery = useGetTrip(tripId);
  const vehiclesQuery = useListVehicles();
  const { mutateAsync: updateTripPlan, error: submitError } = useUpdateTripPlan();

  const goToDetail = () => navigate({ to: "/trips/$tripId", params: { tripId } });

  const handleSubmit = async (data: TripCreateRequest) => {
    try {
      const trip = await updateTripPlan({ tripId, data });
      queryClient.setQueryData(getGetTripQueryKey(tripId), trip);
      await queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
      toast.success(t("edit.success"));
      await goToDetail();
    } catch {
      // The form shows the failure from the mutation's error
    }
  };

  if (tripQuery.isPending || vehiclesQuery.isPending) return <PlanTripSkeleton />;

  if (tripQuery.isError || vehiclesQuery.isError)
    return (
      <PlanTripMessage
        icon={<TriangleAlertIcon />}
        title={tripQuery.isError ? t("states.tripLoadError") : t("states.vehiclesLoadError")}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              if (tripQuery.isError) void tripQuery.refetch();
              if (vehiclesQuery.isError) void vehiclesQuery.refetch();
            }}
          >
            {t("common:actions.retry")}
          </Button>
        }
      >
        {getErrorMessage(tripQuery.error ?? vehiclesQuery.error, t("common:states.loadError"))}
      </PlanTripMessage>
    );

  const trip = tripQuery.data;
  if (trip.status !== TripStatus.PLAN_REJECTED)
    return (
      <PlanTripMessage
        icon={<LockIcon />}
        title={t("edit.notEditableTitle")}
        actions={
          <Button variant="outline" asChild>
            <Link to="/trips/$tripId" params={{ tripId }}>
              {t("edit.toDetail")}
            </Link>
          </Button>
        }
      >
        <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
          {t("edit.notEditableText")} <TripStatusBadge status={trip.status} />
        </span>
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
        defaultValues={toPlanTripFormValues(trip)}
        submitLabel={t("edit.submit")}
        submitError={
          submitError ? getErrorMessage(submitError, t("common:states.actionError")) : undefined
        }
        notice={
          <PlanTripNotice variant="error" title={t("edit.rejectedTitle")}>
            {trip.rejectionReason || t("edit.noReason")}
          </PlanTripNotice>
        }
        onSubmit={handleSubmit}
        onCancel={() => void goToDetail()}
      />
    </PlanTripCard>
  );
};
