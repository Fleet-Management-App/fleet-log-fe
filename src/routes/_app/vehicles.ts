import { createFileRoute } from "@tanstack/react-router";

import { Role } from "@/api/generated/models";
import { VehiclesPage } from "@/modules/vehicles/pages/VehiclesPage";
import { requireAnyRole } from "@/security/requireRole";

// Every member sees the pool; only a Fleet Manager adds vehicles (FLOG-56)
export const Route = createFileRoute("/_app/vehicles")({
  beforeLoad: () => requireAnyRole(Role.DRIVER, Role.FLEET_MANAGER, Role.ACCOUNTANT),
  component: VehiclesPage,
});
