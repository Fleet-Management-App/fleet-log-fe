import type { FC } from "react";

import { useListVehicles } from "@/api/generated/hooks/vehicles/vehicles";

import { VehiclesTable } from "../components/VehiclesTable";

export const VehiclesContainer: FC<{ canAdd: boolean }> = ({ canAdd }) => {
  const { data: vehicles = [], isLoading, isError, refetch } = useListVehicles();

  return (
    <VehiclesTable
      vehicles={vehicles}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => void refetch()}
      canAdd={canAdd}
    />
  );
};
