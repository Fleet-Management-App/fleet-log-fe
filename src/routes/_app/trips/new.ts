import { createFileRoute } from "@tanstack/react-router";

import { Role } from "@/api/generated/models";
import { PlanTripPage } from "@/modules/trips/pages/PlanTripPage";
import { requireAnyRole } from "@/security/requireRole";

// Plan a trip and send it for approval (FLOG-57)
export const Route = createFileRoute("/_app/trips/new")({
  beforeLoad: () => requireAnyRole(Role.DRIVER, Role.FLEET_MANAGER),
  component: PlanTripPage,
});
