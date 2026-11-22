import type { FC } from "react";

import type { TripResponse, VehicleResponse } from "@/api/generated/models";
import { formatDateTime } from "@/modules/common/utils/formatDate";

// "Praha → Plzeň / 10. 11. 2026, 7:30 · Škoda Superb · 2CD 6789" box at the top of the log forms
export const LogTripSummary: FC<{ trip: TripResponse; vehicle?: VehicleResponse }> = ({
  trip,
  vehicle,
}) => (
  <div className="flex flex-col gap-0.5 rounded-lg border bg-muted/40 px-3 py-2.5">
    <span className="font-semibold break-words">
      {trip.fromLocation} → {trip.toLocation}
    </span>
    <span className="text-xs text-muted-foreground">
      {[
        formatDateTime(trip.dateTime),
        vehicle && `${vehicle.make} ${vehicle.model}`,
        vehicle?.plate,
      ]
        .filter(Boolean)
        .join(" · ")}
    </span>
  </div>
);
