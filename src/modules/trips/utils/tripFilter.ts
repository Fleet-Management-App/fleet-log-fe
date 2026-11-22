import { type TripResponse, TripStatus } from "@/api/generated/models";

// Cancelled trips have no chip of their own; they only show under "All"
export const TRIP_FILTERS = [
  "ALL",
  TripStatus.PLANNED,
  TripStatus.PLAN_APPROVED,
  TripStatus.PLAN_REJECTED,
  TripStatus.COMPLETED,
] as const;

export type TripFilter = (typeof TRIP_FILTERS)[number];

export const filterTrips = (trips: TripResponse[], filter: TripFilter): TripResponse[] =>
  filter === "ALL" ? trips : trips.filter((trip) => trip.status === filter);

/** Newest trip date first; the API returns them in creation order. */
export const sortTripsByDateDesc = (trips: TripResponse[]): TripResponse[] =>
  [...trips].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
