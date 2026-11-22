import type { FC } from "react";

import { useListVehicles } from "@/api/generated/hooks/vehicles/vehicles";

import { VehiclesTable } from "../components/VehiclesTable";

export const VehiclesContainer: FC<{ isFleetManager: boolean }> = ({ isFleetManager }) => {
  const { data: vehicles = [], isLoading, isError, refetch } = useListVehicles();

  return (
    <VehiclesTable
      vehicles={vehicles}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => void refetch()}
      canAdd={isFleetManager}
      showStkAndInsurance={isFleetManager}
    />
  );
};
