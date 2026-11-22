import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/modules/common/components/ui/button";

type MyTripsHeaderProps = {
  /** A Fleet Manager gets every trip in the organization, so the page is titled "Trips" */
  showsAllTrips: boolean;
};

export const MyTripsHeader: FC<MyTripsHeaderProps> = ({ showsAllTrips }) => {
  const { t } = useTranslation("trips");

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">
          {showsAllTrips ? t("list.titleAll") : t("list.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {showsAllTrips ? t("list.subtitleAll") : t("list.subtitle")}
        </p>
      </div>
      <Button size="lg" asChild>
        <Link to="/trips/new">
          <Plus data-icon="inline-start" />
          {t("list.planTrip")}
        </Link>
      </Button>
    </div>
  );
};
