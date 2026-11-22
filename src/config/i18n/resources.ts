import csApprovals from "@/locales/cs/approvals.json";
import csAuth from "@/locales/cs/auth.json";
import csCommon from "@/locales/cs/common.json";
import csDashboard from "@/locales/cs/dashboard.json";
import csOrganizations from "@/locales/cs/organizations.json";
import csTripLog from "@/locales/cs/tripLog.json";
import csTripPlan from "@/locales/cs/tripPlan.json";
import csTrips from "@/locales/cs/trips.json";
import csUsers from "@/locales/cs/users.json";
import csVehicles from "@/locales/cs/vehicles.json";
import enApprovals from "@/locales/en/approvals.json";
import enAuth from "@/locales/en/auth.json";
import enCommon from "@/locales/en/common.json";
import enDashboard from "@/locales/en/dashboard.json";
import enOrganizations from "@/locales/en/organizations.json";
import enTripLog from "@/locales/en/tripLog.json";
import enTripPlan from "@/locales/en/tripPlan.json";
import enTrips from "@/locales/en/trips.json";
import enUsers from "@/locales/en/users.json";
import enVehicles from "@/locales/en/vehicles.json";

// One namespace per feature area, one JSON file per namespace and language (src/locales/<lang>/).
// English is the source of truth: its files define the keys, and the types in @types/i18next.d.ts.
export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    organizations: enOrganizations,
    users: enUsers,
    dashboard: enDashboard,
    vehicles: enVehicles,
    tripPlan: enTripPlan,
    trips: enTrips,
    tripLog: enTripLog,
    approvals: enApprovals,
  },
  cs: {
    common: csCommon,
    auth: csAuth,
    organizations: csOrganizations,
    users: csUsers,
    dashboard: csDashboard,
    vehicles: csVehicles,
    tripPlan: csTripPlan,
    trips: csTrips,
    tripLog: csTripLog,
    approvals: csApprovals,
  },
} as const;

export type Language = keyof typeof resources;

export const LANGUAGES: Language[] = ["en", "cs"];
