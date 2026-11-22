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
import { formatDate, formatNumber, formatPrice } from "@/modules/common/utils/formatDate";

import type { PendingDecision } from "../models/decision";
import { describeTrip, formatRoute } from "../utils/describeTrip";
import { approvalsCellClass, approvalsHeadClass } from "../utils/tableClasses";
import { DecisionActions } from "./DecisionActions";

import { ReceiptThumbnail } from "./ReceiptThumbnail";
import { VehicleCell } from "./VehicleCell";

type FuelApprovalsTableProps = {
  // Only trips that carry a fuel entry
  trips: TripResponse[];
  vehiclesById: Map<string, VehicleResponse>;
  pending: Record<string, PendingDecision>;
  onApprove: (trip: TripResponse) => void;
  onReject: (trip: TripResponse) => void;
  onShowReceipt: (trip: TripResponse) => void;
};

export const FuelApprovalsTable: FC<FuelApprovalsTableProps> = ({
  trips,
  vehiclesById,
  pending,
  onApprove,
  onReject,
  onShowReceipt,
}) => {
  const { t } = useTranslation("approvals");

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={approvalsHeadClass}>{t("columns.tripDate")}</TableHead>
            <TableHead className={approvalsHeadClass}>{t("columns.driver")}</TableHead>
            <TableHead className={approvalsHeadClass}>{t("columns.route")}</TableHead>
            <TableHead className={approvalsHeadClass}>{t("columns.vehicle")}</TableHead>
            <TableHead className={approvalsHeadClass}>{t("columns.fuel")}</TableHead>
            <TableHead className={approvalsHeadClass}>{t("columns.receipt")}</TableHead>
            <TableHead className={approvalsHeadClass}>
              <span className="sr-only">{t("columns.actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip.id}>
              <TableCell className={approvalsCellClass}>{formatDate(trip.dateTime)}</TableCell>
              <TableCell className={approvalsCellClass}>{trip.driverName}</TableCell>
              <TableCell className={approvalsCellClass}>{formatRoute(trip)}</TableCell>
              <TableCell className={approvalsCellClass}>
                <VehicleCell vehicle={vehiclesById.get(trip.vehicleId)} />
              </TableCell>
              <TableCell className={approvalsCellClass}>
                {trip.fuel && (
                  <div className="flex flex-col">
                    <span>{t("liters", { value: formatNumber(trip.fuel.liters, 1) })}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatPrice(trip.fuel.price)}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell className={approvalsCellClass}>
                <ReceiptThumbnail
                  trip={trip}
                  alt={t("receipt.alt", { trip: describeTrip(trip) })}
                  onOpen={() => onShowReceipt(trip)}
                />
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
