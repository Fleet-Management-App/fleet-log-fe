import { type FC, useMemo, useState } from "react";

import { Link } from "@tanstack/react-router";
import { CircleAlert, MapPinned, SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useListTrips } from "@/api/generated/hooks/trips/trips";
import { useListVehicles } from "@/api/generated/hooks/vehicles/vehicles";
import { Role } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import { hasAnyRole } from "@/security/requireRole";
import { useCurrentUser } from "@/security/useCurrentUser";

import { MyTripsHeader } from "../components/MyTripsHeader";
import { TripFilterChips } from "../components/TripFilterChips";
import { TripMessageCard } from "../components/TripMessageCard";
import { TripsTable } from "../components/TripsTable";
import { filterTrips, sortTripsByDateDesc, type TripFilter } from "../utils/tripFilter";

export const MyTripsContainer: FC = () => {
  const { t } = useTranslation(["trips", "common"]);
  const me = useCurrentUser();
  // The same endpoint returns the caller's own trips to a Driver and every trip to a Fleet Manager
  const showsAllTrips = hasAnyRole(me, Role.FLEET_MANAGER);
  const [filter, setFilter] = useState<TripFilter>("ALL");

  // The whole list is loaded once and filtered here; the chips then switch without a request
  const tripsQuery = useListTrips();
  const vehiclesQuery = useListVehicles();

  const vehiclesById = useMemo(
    () => new Map((vehiclesQuery.data ?? []).map((vehicle) => [vehicle.id, vehicle])),
    [vehiclesQuery.data],
  );
  const allTrips = useMemo(() => sortTripsByDateDesc(tripsQuery.data ?? []), [tripsQuery.data]);
  const visibleTrips = useMemo(() => filterTrips(allTrips, filter), [allTrips, filter]);

  const renderContent = () => {
    if (tripsQuery.isError) {
      return (
        <TripMessageCard
          icon={CircleAlert}
          title={t("list.error.title")}
          description={t("list.error.description")}
          action={
            <Button variant="outline" onClick={() => tripsQuery.refetch()}>
              {t("common:actions.retry")}
            </Button>
          }
        />
      );
    }
    // Vehicles only decorate the rows; without them the list still renders, with a dash
    const isLoading = tripsQuery.isLoading || vehiclesQuery.isLoading;
    if (!isLoading && allTrips.length === 0) {
      return (
        <TripMessageCard
          icon={MapPinned}
          title={t("list.empty.title")}
          description={showsAllTrips ? t("list.empty.descriptionAll") : t("list.empty.description")}
          action={
            <Button asChild>
              <Link to="/trips/new">{t("list.planTrip")}</Link>
            </Button>
          }
        />
      );
    }
    if (!isLoading && visibleTrips.length === 0) {
      return (
        <TripMessageCard
          icon={SearchX}
          title={t("list.emptyFilter.title")}
          description={t("list.emptyFilter.description")}
          action={
            <Button variant="outline" onClick={() => setFilter("ALL")}>
              {t("list.emptyFilter.showAll")}
            </Button>
          }
        />
      );
    }
    return (
      <TripsTable
        trips={visibleTrips}
        vehiclesById={vehiclesById}
        showDriver={showsAllTrips}
        isLoading={isLoading}
      />
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <MyTripsHeader showsAllTrips={showsAllTrips} />
      <TripFilterChips value={filter} onChange={setFilter} />
      {renderContent()}
    </div>
  );
};
