import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { FuelStatus, type TripResponse, TripStatus } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { formatNumber, formatPrice } from "@/modules/common/utils/formatDate";

import { FuelStatusBadge } from "./FuelStatusBadge";
import { TripDetailFields } from "./TripDetailFields";
import { TripFuelReceipt } from "./TripFuelReceipt";

const STATUS_NOTE = {
  [FuelStatus.PENDING]: "pending",
  [FuelStatus.APPROVED]: "approved",
  [FuelStatus.REJECTED]: "rejected",
} as const satisfies Record<FuelStatus, string>;

/**
 * Fuel is optional and approved on its own (BR-06): nothing here ever holds up the trip's
 * completion, which only needs the odometer.
 */
export const TripFuelCard: FC<{ trip: TripResponse }> = ({ trip }) => {
  const { t } = useTranslation("trips");
  const { fuel, status } = trip;
  const canLogFuel = status === TripStatus.PLAN_APPROVED || status === TripStatus.COMPLETED;

  const fuelLink = (label: string, variant: "outline" | "default") => (
    <Button variant={variant} size="lg" className="w-full" asChild>
      <Link to="/trips/$tripId/fuel" params={{ tripId: trip.id }}>
        {label}
      </Link>
    </Button>
  );

  const renderBody = () => {
    if (!fuel) {
      if (canLogFuel) {
        return (
          <div className="flex flex-col gap-4">
            <CardDescription>{t("detail.fuel.optional")}</CardDescription>
            {fuelLink(t("detail.fuel.add"), "outline")}
          </div>
        );
      }
      if (status === TripStatus.PLANNED || status === TripStatus.PLAN_REJECTED) {
        return <CardDescription>{t("detail.fuel.afterApproval")}</CardDescription>;
      }
      return <CardDescription>{t("detail.fuel.none")}</CardDescription>;
    }

    return (
      <div className="flex flex-col gap-4">
        {fuel.status === FuelStatus.REJECTED && fuel.rejectionReason && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {t("detail.reason", { reason: fuel.rejectionReason })}
          </p>
        )}
        <TripDetailFields
          fields={[
            {
              label: t("detail.fuel.liters"),
              value: t("detail.fuel.litersValue", { value: formatNumber(fuel.liters, 1) }),
            },
            { label: t("detail.fuel.price"), value: formatPrice(fuel.price) },
            {
              label: t("detail.fuel.receipt"),
              value: <TripFuelReceipt tripId={trip.id} hasReceipt={fuel.hasReceipt} />,
            },
          ]}
        />
        <CardDescription>{t(`detail.fuel.${STATUS_NOTE[fuel.status]}`)}</CardDescription>
        {/* A rejected entry can be resubmitted through the same form (BR-07) */}
        {fuel.status === FuelStatus.REJECTED && fuelLink(t("detail.fuel.submitAgain"), "default")}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">{t("detail.fuel.title")}</CardTitle>
        {fuel && (
          <CardAction>
            <FuelStatusBadge status={fuel.status} />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>{renderBody()}</CardContent>
    </Card>
  );
};
