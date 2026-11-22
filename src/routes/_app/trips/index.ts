import { createFileRoute } from "@tanstack/react-router";

import { Role } from "@/api/generated/models";
import { MyTripsPage } from "@/modules/trips/pages/MyTripsPage";
import { requireAnyRole } from "@/security/requireRole";

// A Driver sees their own trips, a Fleet Manager every trip in the organization (FLOG-58)
export const Route = createFileRoute("/_app/trips/")({
  beforeLoad: () => requireAnyRole(Role.DRIVER, Role.FLEET_MANAGER),
  component: MyTripsPage,
});
