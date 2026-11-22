import type { FC } from "react";

import { useTranslation } from "react-i18next";

import type { TripResponse, VehicleResponse } from "@/api/generated/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/common/components/ui/card";
import { formatDateTime } from "@/modules/common/utils/formatDate";

import { type TripDetailField, TripDetailFields } from "./TripDetailFields";

type TripDataCardProps = {
  trip: TripResponse;
  vehicle: VehicleResponse | undefined;
  showDriver: boolean;
};

export const TripDataCard: FC<TripDataCardProps> = ({ trip, vehicle, showDriver }) => {
  const { t } = useTranslation("trips");

  const fields: TripDetailField[] = [
    { label: t("detail.data.dateTime"), value: formatDateTime(trip.dateTime) },
    ...(showDriver ? [{ label: t("detail.data.driver"), value: trip.driverName }] : []),
    { label: t("detail.data.from"), value: trip.fromLocation },
    { label: t("detail.data.to"), value: trip.toLocation },
    { label: t("detail.data.purpose"), value: trip.purpose },
    {
      label: t("detail.data.vehicle"),
      value: vehicle ? `${vehicle.make} ${vehicle.model} · ${vehicle.plate}` : "—",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">{t("detail.data.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <TripDetailFields fields={fields} />
      </CardContent>
    </Card>
  );
};
