import type { FC } from "react";

import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { TripResponse, VehicleResponse } from "@/api/generated/models";
import { Card } from "@/modules/common/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/common/components/ui/table";
import { formatDate, formatTime } from "@/modules/common/utils/formatDate";

import { FuelStatusBadge } from "./FuelStatusBadge";
import { TripStatusBadge } from "./TripStatusBadge";

const SKELETON_ROWS = 5;

type TripsTableProps = {
  trips: TripResponse[];
  vehiclesById: Map<string, VehicleResponse>;
  showDriver: boolean;
  isLoading: boolean;
};

const headClass = "h-10 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export const TripsTable: FC<TripsTableProps> = ({ trips, vehiclesById, showDriver, isLoading }) => {
  const { t } = useTranslation("trips");
  const navigate = useNavigate();
  const columnCount = showDriver ? 7 : 6;

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={headClass}>{t("list.columns.date")}</TableHead>
            {showDriver && <TableHead className={headClass}>{t("list.columns.driver")}</TableHead>}
            <TableHead className={headClass}>{t("list.columns.route")}</TableHead>
            <TableHead className={headClass}>{t("list.columns.purpose")}</TableHead>
            <TableHead className={headClass}>{t("list.columns.vehicle")}</TableHead>
            <TableHead className={headClass}>{t("list.columns.status")}</TableHead>
            <TableHead className={headClass}>{t("list.columns.fuel")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: SKELETON_ROWS }, (_, index) => (
                <TableRow key={index} aria-busy="true" className="hover:bg-transparent">
                  {Array.from({ length: columnCount }, (_, cell) => (
                    <TableCell key={cell} className="px-4 py-4">
                      <div className="h-4 w-full max-w-28 animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : trips.map((trip) => {
                const vehicle = vehiclesById.get(trip.vehicleId);
                const goToDetail = () =>
                  navigate({ to: "/trips/$tripId", params: { tripId: trip.id } });
                return (
                  <TableRow key={trip.id} className="cursor-pointer" onClick={goToDetail}>
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col">
                        <span>{formatDate(trip.dateTime)}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(trip.dateTime)}
                        </span>
                      </div>
                    </TableCell>
                    {showDriver && <TableCell className="px-4 py-3">{trip.driverName}</TableCell>}
                    <TableCell className="px-4 py-3">
                      {/* The real link keeps the row reachable by keyboard and openable in a new tab */}
                      <Link
                        to="/trips/$tripId"
                        params={{ tripId: trip.id }}
                        className="hover:underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {trip.fromLocation} → {trip.toLocation}
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {trip.purpose}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {vehicle ? (
                        <div className="flex flex-col">
                          <span>
                            {vehicle.make} {vehicle.model}
                          </span>
                          <span className="text-xs text-muted-foreground">{vehicle.plate}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <TripStatusBadge status={trip.status} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {trip.fuel ? (
                        <FuelStatusBadge status={trip.fuel.status} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </Card>
  );
};
