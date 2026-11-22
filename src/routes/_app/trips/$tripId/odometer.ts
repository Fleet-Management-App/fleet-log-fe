import { createFileRoute } from "@tanstack/react-router";

import { Role } from "@/api/generated/models";
import { LogOdometerPage } from "@/modules/trips/pages/LogOdometerPage";
import { requireAnyRole } from "@/security/requireRole";

// Log odometer start/end, which completes the trip (FLOG-59)
export const Route = createFileRoute("/_app/trips/$tripId/odometer")({
  beforeLoad: () => requireAnyRole(Role.DRIVER, Role.FLEET_MANAGER),
  component: LogOdometerPage,
});
