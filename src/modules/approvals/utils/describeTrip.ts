import type { TripResponse } from "@/api/generated/models";

/** Praha → Brno */
export const formatRoute = (trip: TripResponse) => `${trip.fromLocation} → ${trip.toLocation}`;

/** Jan Novák · Praha → Brno, how a trip is named in dialogs, toasts and errors */
export const describeTrip = (trip: TripResponse) => `${trip.driverName} · ${formatRoute(trip)}`;

/** Oldest first, so what waits longest is decided first */
export const sortByTripDate = (trips: TripResponse[]) =>
  [...trips].sort((a, b) => a.dateTime.localeCompare(b.dateTime));
