import type { FC } from "react";

import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { LogTripShell } from "../components/LogTripShell";
import { LogOdometerContainer } from "../containers/LogOdometerContainer";

export const LogOdometerPage: FC = () => {
  const { t } = useTranslation("tripLog");
  const { tripId } = useParams({ from: "/_app/trips/$tripId/odometer" });

  return (
    <LogTripShell
      tripId={tripId}
      title={t("odometer.title")}
      description={t("odometer.description")}
    >
      <LogOdometerContainer tripId={tripId} />
    </LogTripShell>
  );
};
