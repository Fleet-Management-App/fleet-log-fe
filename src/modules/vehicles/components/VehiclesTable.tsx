import type { FC, ReactNode } from "react";

import { useTranslation } from "react-i18next";

import type { VehicleResponse } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/common/components/ui/table";
import { formatNumber } from "@/modules/common/utils/formatDate";

import { DueDateCell } from "./DueDateCell";
import { VehicleStatusBadge } from "./VehicleStatusBadge";

type VehiclesTableProps = {
  vehicles: VehicleResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  // The empty state points a Fleet Manager to the add button; others just see that there's nothing
  canAdd: boolean;
  // BR-02: STK and insurance due dates are for the Fleet Manager only; the vignette is for everyone
  showStkAndInsurance: boolean;
};

export const VehiclesTable: FC<VehiclesTableProps> = ({
  vehicles,
  isLoading,
  isError,
  onRetry,
  canAdd,
  showStkAndInsurance,
}) => {
  const { t } = useTranslation("vehicles");
  const { t: tCommon } = useTranslation();

  const columnCount = showStkAndInsurance ? 8 : 6;

  let placeholder: ReactNode = null;
  if (isLoading) placeholder = tCommon("states.loading");
  else if (isError)
    placeholder = (
      <div className="flex flex-col items-center gap-3">
        <span>{tCommon("states.loadError")}</span>
        <Button size="sm" variant="outline" onClick={onRetry}>
          {tCommon("actions.retry")}
        </Button>
      </div>
    );
  else if (vehicles.length === 0)
    placeholder = (
      <div className="flex flex-col items-center gap-1">
        <span className="font-medium text-foreground">{t("empty.title")}</span>
        <span>{canAdd ? t("empty.fleetManager") : t("empty.readOnly")}</span>
      </div>
    );

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="text-xs uppercase [&>th]:px-4 [&>th]:font-semibold">
            <TableHead>{t("table.plate")}</TableHead>
            <TableHead>{t("table.vehicle")}</TableHead>
            <TableHead>{t("table.fuelType")}</TableHead>
            <TableHead className="text-right">{t("table.odometer")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            {showStkAndInsurance && (
              <>
                <TableHead>{t("table.stk")}</TableHead>
                <TableHead>{t("table.insurance")}</TableHead>
              </>
            )}
            <TableHead>{t("table.vignette")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placeholder ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columnCount}
                className="py-10 text-center whitespace-normal text-muted-foreground"
              >
                {placeholder}
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id} className="[&>td]:px-4 [&>td]:py-3">
                <TableCell className="font-medium">{vehicle.plate}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {vehicle.make} {vehicle.model}
                    </span>
                    <span className="text-xs text-muted-foreground">{vehicle.vin}</span>
                  </div>
                </TableCell>
                <TableCell>{t(`fuelType.${vehicle.fuelType}`)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {t("table.km", { value: formatNumber(vehicle.odometerKm, 0) })}
                </TableCell>
                <TableCell>
                  <VehicleStatusBadge status={vehicle.status} />
                </TableCell>
                {showStkAndInsurance && (
                  <>
                    <TableCell>
                      <DueDateCell dueDate={vehicle.stkDueDate} />
                    </TableCell>
                    <TableCell>
                      <DueDateCell dueDate={vehicle.insuranceDueDate} />
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <DueDateCell dueDate={vehicle.vignetteDueDate} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
