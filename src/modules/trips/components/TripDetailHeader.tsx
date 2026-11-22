import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { type TripResponse, TripStatus } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";

import { CancelTripButton } from "./CancelTripButton";
import { TripStatusBadge } from "./TripStatusBadge";

type TripDetailHeaderProps = {
  trip: TripResponse;
  showsAllTrips: boolean;
  isCancelling: boolean;
  onCancel: () => void;
};

export const TripDetailHeader: FC<TripDetailHeaderProps> = ({
  trip,
  showsAllTrips,
  isCancelling,
  onCancel,
}) => {
  const { t } = useTranslation("trips");

  return (
    <div className="flex flex-col gap-2">
      <TripDetailBackLink showsAllTrips={showsAllTrips} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">
            {trip.fromLocation} → {trip.toLocation}
          </h1>
          <TripStatusBadge status={trip.status} />
        </div>
        {/* The BE allows cancelling only a still-planned trip and editing only a rejected plan */}
        {trip.status === TripStatus.PLANNED && (
          <CancelTripButton isCancelling={isCancelling} onConfirm={onCancel} />
        )}
        {trip.status === TripStatus.PLAN_REJECTED && (
          <Button size="lg" asChild>
            <Link to="/trips/$tripId/edit" params={{ tripId: trip.id }}>
              {t("detail.editPlan")}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export const TripDetailBackLink: FC<{ showsAllTrips: boolean }> = ({ showsAllTrips }) => {
  const { t } = useTranslation("trips");
  return (
    <Link
      to="/trips"
      className="flex w-fit items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
    >
      <ArrowLeft className="size-3.5" />
      {showsAllTrips ? t("detail.backAll") : t("detail.back")}
    </Link>
  );
};
