import { type VehicleResponse, VehicleStatus } from "@/api/generated/models";

// No BR sets the window; 30 days gives the driver time to have the vignette renewed
const VIGNETTE_EXPIRING_DAYS = 30;

export type VehicleBlockReason = "SUSPENDED" | "STK_EXPIRED";
export type VignetteState = "VALID" | "EXPIRING" | "EXPIRED";

export type VehicleAvailability = {
  vehicle: VehicleResponse;
  // Set when the vehicle can't be picked (BR-01)
  blockReason?: VehicleBlockReason;
  // Undefined when the vehicle has no vignette date on record
  vignetteState?: VignetteState;
};

const pad = (value: number) => String(value).padStart(2, "0");

/** The local calendar day as YYYY-MM-DD, the format of `<input type="date">` and the BE's due dates. */
export const toLocalIsoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (isoDate: string, days: number) => {
  const date = new Date(`${isoDate}T00:00`);
  date.setDate(date.getDate() + days);
  return toLocalIsoDate(date);
};

// YYYY-MM-DD strings compare correctly as plain strings
const getBlockReason = (
  vehicle: VehicleResponse,
  today: string,
): VehicleBlockReason | undefined => {
  if (vehicle.status === VehicleStatus.SUSPENDED) return "SUSPENDED";
  // Same check as the BE: the STK is still valid on its due date
  if (vehicle.stkDueDate && vehicle.stkDueDate < today) return "STK_EXPIRED";
  return undefined;
};

// Measured against the trip's date, since that is when the vehicle is on the road (BR-02).
// An expired vignette only warns: no BR forbids planning the trip.
const getVignetteState = (
  vehicle: VehicleResponse,
  tripDate: string,
): VignetteState | undefined => {
  const dueDate = vehicle.vignetteDueDate;
  if (!dueDate) return undefined;
  if (dueDate < tripDate) return "EXPIRED";
  if (dueDate <= addDays(tripDate, VIGNETTE_EXPIRING_DAYS)) return "EXPIRING";
  return "VALID";
};

export const getVehicleAvailability = (
  vehicle: VehicleResponse,
  tripDate: string,
  today = toLocalIsoDate(new Date()),
): VehicleAvailability => ({
  vehicle,
  blockReason: getBlockReason(vehicle, today),
  vignetteState: getVignetteState(vehicle, tripDate || today),
});

/** Škoda Superb · 2CD 6789 */
export const getVehicleLabel = ({ make, model, plate }: VehicleResponse) =>
  `${make} ${model} · ${plate}`;
