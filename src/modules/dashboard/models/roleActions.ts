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
  title: string;
  description: string;
  icon: LucideIcon;
  // Set for what already works; the rest is shown as "coming soon"
  to?: "/organization/members";
};

// What each role can do, following the responsibilities in AGENTS.md / SPEC pages
export const ROLE_ACTIONS: Record<Role, RoleAction[]> = {
  [Role.FLEET_MANAGER]: [
    {
      title: "Members & invitations",
      description: "Invite drivers and accountants, change roles.",
      icon: Users,
      to: "/organization/members",
    },
    {
      title: "Approve trip plans",
      description: "Approve or reject planned trips and their vehicle.",
      icon: ClipboardCheck,
    },
    {
      title: "Anomalies",
      description: "Odometer gaps and suspicious fuel fill-ups.",
      icon: TriangleAlert,
    },
    {
      title: "Service & STK",
      description: "Service history and upcoming deadlines.",
      icon: Wrench,
    },
  ],
  [Role.DRIVER]: [
    {
      title: "Plan a trip",
      description: "Pick a vehicle from the pool and send the plan for approval.",
      icon: Route,
    },
    { title: "Log fuel", description: "Add a fill-up with its receipt.", icon: Fuel },
    {
      title: "Report a problem",
      description: "Something wrong with a car you drove.",
      icon: CircleAlert,
    },
    { title: "My trips", description: "Your logbook entries.", icon: History },
  ],
  [Role.ACCOUNTANT]: [
    { title: "Financial history", description: "Fuel and service costs by period.", icon: History },
    {
      title: "Export to Excel",
      description: "Download the history for a quarter.",
      icon: FileSpreadsheet,
    },
  ],
};
