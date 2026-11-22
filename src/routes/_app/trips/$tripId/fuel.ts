import { createFileRoute } from "@tanstack/react-router";

import { Role } from "@/api/generated/models";
import { LogFuelPage } from "@/modules/trips/pages/LogFuelPage";
import { requireAnyRole } from "@/security/requireRole";

// Optional fuel fill-up with a receipt photo, BR-06 (FLOG-59)
export const Route = createFileRoute("/_app/trips/$tripId/fuel")({
  beforeLoad: () => requireAnyRole(Role.DRIVER, Role.FLEET_MANAGER),
  component: LogFuelPage,
});
