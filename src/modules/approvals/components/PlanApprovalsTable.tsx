import type { FC } from "react";

import { useTranslation } from "react-i18next";

import type { TripResponse, VehicleResponse } from "@/api/generated/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/common/components/ui/table";
import { formatDate, formatTime } from "@/modules/common/utils/formatDate";

import type { PendingDecision } from "../models/decision";
import { formatRoute } from "../utils/describeTrip";
import { approvalsCellClass, approvalsHeadClass } from "../utils/tableClasses";
import { DecisionActions } from "./DecisionActions";
import { VehicleCell } from "./VehicleCell";

type PlanApprovalsTableProps = {
  trips: TripResponse[];
  vehiclesById: Map<string, VehicleResponse>;
  pending: Record<string, PendingDecision>;
  onApprove: (trip: TripResponse) => void;
  onReject: (trip: TripResponse) => void;
};

export const PlanApprovalsTable: FC<PlanApprovalsTableProps> = ({
  trips,
  vehiclesById,
  pending,
  onApprove,
  onReject,
}) => {
  const { t } = useTranslation("approvals");

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={approvalsHeadClass}>{t("columns.term")}</TableHead>
            <TableHead className={approvalsHeadClass}>{t("columns.driver")}</TableHead>
            <TableHead className={approvalsHeadClass}>{t("columns.route")}</TableHead>
            <TableHead className={approvalsHeadClass}>{t("columns.purpose")}</TableHead>
            <TableHead className={approvalsHeadClass}>{t("columns.vehicle")}</TableHead>
            <TableHead className={approvalsHeadClass}>
              <span className="sr-only">{t("columns.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip.id}>
              <TableCell className={approvalsCellClass}>
                <div className="flex flex-col">
                  <span>{formatDate(trip.dateTime)}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(trip.dateTime)}</span>
                </div>
              </TableCell>
              <TableCell className={approvalsCellClass}>{trip.driverName}</TableCell>
              <TableCell className={approvalsCellClass}>{formatRoute(trip)}</TableCell>
              <TableCell className={`${approvalsCellClass} text-muted-foreground`}>
                {trip.purpose}
              </TableCell>
              <TableCell className={approvalsCellClass}>
                <VehicleCell vehicle={vehiclesById.get(trip.vehicleId)} />
              </TableCell>
              <TableCell className={`${approvalsCellClass} text-right`}>
                <DecisionActions
                  pending={pending[trip.id]}
                  onApprove={() => onApprove(trip)}
                  onReject={() => onReject(trip)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
