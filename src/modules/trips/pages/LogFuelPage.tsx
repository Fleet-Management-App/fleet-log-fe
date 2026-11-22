import type { FC } from "react";

import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { LogTripShell } from "../components/LogTripShell";
import { LogFuelContainer } from "../containers/LogFuelContainer";

export const LogFuelPage: FC = () => {
  const { t } = useTranslation("tripLog");
  const { tripId } = useParams({ from: "/_app/trips/$tripId/fuel" });

  return (
    <LogTripShell tripId={tripId} title={t("fuel.title")} description={t("fuel.description")}>
      <LogFuelContainer tripId={tripId} />
    </LogTripShell>
  );
};
