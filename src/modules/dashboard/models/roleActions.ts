import type { LucideIcon } from "lucide-react";
import {
  CircleAlert,
  ClipboardCheck,
  FileSpreadsheet,
  Fuel,
  History,
  Route,
  TriangleAlert,
  Users,
  Wrench,
} from "lucide-react";

import { Role } from "@/api/generated/models";

export type RoleAction = {
  // Picks the title and description under `actions.<id>` in the dashboard translations
  id:
    | "members"
    | "approveTripPlans"
    | "anomalies"
    | "service"
    | "planTrip"
    | "logFuel"
    | "reportProblem"
    | "myTrips"
    | "financialHistory"
    | "exportToExcel";
  icon: LucideIcon;
  // Set for what already works; the rest is shown as "coming soon"
  to?: "/organization/members";
};

// What each role can do, following the responsibilities in AGENTS.md / SPEC pages
export const ROLE_ACTIONS: Record<Role, RoleAction[]> = {
  [Role.FLEET_MANAGER]: [
    { id: "members", icon: Users, to: "/organization/members" },
    { id: "approveTripPlans", icon: ClipboardCheck },
    { id: "anomalies", icon: TriangleAlert },
    { id: "service", icon: Wrench },
  ],
  [Role.DRIVER]: [
    { id: "planTrip", icon: Route },
    { id: "logFuel", icon: Fuel },
    { id: "reportProblem", icon: CircleAlert },
    { id: "myTrips", icon: History },
  ],
  [Role.ACCOUNTANT]: [
    { id: "financialHistory", icon: History },
    { id: "exportToExcel", icon: FileSpreadsheet },
  ],
};
