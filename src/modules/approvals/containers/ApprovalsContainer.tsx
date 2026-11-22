import { type FC, type ReactNode, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { useListTrips } from "@/api/generated/hooks/trips/trips";
import { useListVehicles } from "@/api/generated/hooks/vehicles/vehicles";
import { FuelStatus, TripStatus } from "@/api/generated/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/common/components/ui/tabs";

import { ApprovalsLoadError } from "../components/ApprovalsLoadError";
import { ApprovalsLoading } from "../components/ApprovalsLoading";
import { sortByTripDate } from "../utils/describeTrip";
import { FuelApprovalsContainer } from "./FuelApprovalsContainer";
import { PlanApprovalsContainer } from "./PlanApprovalsContainer";

type ApprovalsTab = "plans" | "fuel";

// Figma tabs are pill buttons: filled when active, outlined otherwise
const tabTriggerClass =
  "h-8 flex-none rounded-md border-border bg-background px-3 font-normal text-muted-foreground data-active:border-primary data-active:bg-primary data-active:text-primary-foreground data-active:hover:text-primary-foreground group-data-[variant=default]/tabs-list:data-active:shadow-none dark:data-active:border-primary dark:data-active:bg-primary dark:data-active:text-primary-foreground";

export const ApprovalsContainer: FC = () => {
  const { t } = useTranslation("approvals");
  const [tab, setTab] = useState<ApprovalsTab>("plans");
  // A Fleet Manager gets every trip of the organization; one list feeds both tabs
  // The queue changes under the Fleet Manager (drivers plan, cancel and log fuel), so it refreshes
  // itself while the page is open
  const tripsQuery = useListTrips(undefined, { query: { refetchInterval: 30 * 1000 } });
  const vehiclesQuery = useListVehicles();

  const { planTrips, fuelTrips } = useMemo(() => {
    const trips = tripsQuery.data ?? [];
    return {
      planTrips: sortByTripDate(trips.filter((trip) => trip.status === TripStatus.PLANNED)),
      // Independent of the trip status: fuel never waits for, nor blocks, the plan (BR-06)
      fuelTrips: sortByTripDate(trips.filter((trip) => trip.fuel?.status === FuelStatus.PENDING)),
    };
  }, [tripsQuery.data]);

  const vehiclesById = useMemo(
    () => new Map((vehiclesQuery.data ?? []).map((vehicle) => [vehicle.id, vehicle])),
    [vehiclesQuery.data],
  );

  const isLoading = tripsQuery.isLoading || vehiclesQuery.isLoading;
  const isError = tripsQuery.isError || vehiclesQuery.isError;
  const isLoaded = !isLoading && !isError;

  const retry = () => {
    if (tripsQuery.isError) void tripsQuery.refetch();
    if (vehiclesQuery.isError) void vehiclesQuery.refetch();
  };

  const renderContent = (content: ReactNode) => {
    if (isLoading) return <ApprovalsLoading />;
    if (isError)
      return (
        <ApprovalsLoadError
          isRetrying={tripsQuery.isFetching || vehiclesQuery.isFetching}
          onRetry={retry}
        />
      );
    return content;
  };

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as ApprovalsTab)} className="gap-4">
      <TabsList className="h-auto gap-2 bg-transparent p-0 group-data-horizontal/tabs:h-auto">
        <TabsTrigger value="plans" className={tabTriggerClass}>
          {isLoaded ? t("tabs.plansWithCount", { count: planTrips.length }) : t("tabs.plans")}
        </TabsTrigger>
        <TabsTrigger value="fuel" className={tabTriggerClass}>
          {isLoaded ? t("tabs.fuelWithCount", { count: fuelTrips.length }) : t("tabs.fuel")}
        </TabsTrigger>
      </TabsList>
      {/* Kept mounted, so a decision still running or its error survives a switch of tabs */}
      <TabsContent value="plans" forceMount className="data-[state=inactive]:hidden">
        {renderContent(<PlanApprovalsContainer trips={planTrips} vehiclesById={vehiclesById} />)}
      </TabsContent>
      <TabsContent value="fuel" forceMount className="data-[state=inactive]:hidden">
        {renderContent(<FuelApprovalsContainer trips={fuelTrips} vehiclesById={vehiclesById} />)}
      </TabsContent>
    </Tabs>
  );
};
