import { createFileRoute } from "@tanstack/react-router";

import { Role } from "@/api/generated/models";
import { EditTripPlanPage } from "@/modules/trips/pages/EditTripPlanPage";
import { requireAnyRole } from "@/security/requireRole";

// Edit and resubmit a plan-rejected trip, BR-07 (FLOG-57)
export const Route = createFileRoute("/_app/trips/$tripId/edit")({
  beforeLoad: () => requireAnyRole(Role.DRIVER, Role.FLEET_MANAGER),
  component: EditTripPlanPage,
});
