import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { type TripResponse, TripStatus } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { formatNumber } from "@/modules/common/utils/formatDate";

import { TripDetailFields } from "./TripDetailFields";

export const TripOdometerCard: FC<{ trip: TripResponse }> = ({ trip }) => {
  const { t } = useTranslation("trips");
  const { status, odometerStartKm, odometerEndKm } = trip;
  const km = (value: number) => t("detail.odometer.km", { value: formatNumber(value, 0) });

  const renderBody = () => {
    if (status === TripStatus.PLAN_APPROVED) {
      return (
        <div className="flex flex-col gap-4">
          <CardDescription>{t("detail.odometer.prompt")}</CardDescription>
          <Button size="lg" className="w-full" asChild>
            <Link to="/trips/$tripId/odometer" params={{ tripId: trip.id }}>
              {t("detail.odometer.log")}
            </Link>
          </Button>
        </div>
      );
    }
    if (odometerStartKm != null && odometerEndKm != null) {
      return (
        <TripDetailFields
          fields={[
            { label: t("detail.odometer.start"), value: km(odometerStartKm) },
            { label: t("detail.odometer.end"), value: km(odometerEndKm) },
            {
              label: t("detail.odometer.distance"),
              value: <span className="font-semibold">{km(odometerEndKm - odometerStartKm)}</span>,
            },
          ]}
        />
      );
    }
    if (status === TripStatus.PLANNED || status === TripStatus.PLAN_REJECTED) {
      return <CardDescription>{t("detail.odometer.afterApproval")}</CardDescription>;
    }
    return <CardDescription>{t("detail.odometer.notLogged")}</CardDescription>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">{t("detail.odometer.title")}</CardTitle>
      </CardHeader>
      <CardContent>{renderBody()}</CardContent>
    </Card>
  );
};
