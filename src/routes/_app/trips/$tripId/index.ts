import { createFileRoute } from "@tanstack/react-router";

import { Role } from "@/api/generated/models";
import { TripDetailPage } from "@/modules/trips/pages/TripDetailPage";
import { requireAnyRole } from "@/security/requireRole";

// Trip detail with the next action for its status (FLOG-58)
export const Route = createFileRoute("/_app/trips/$tripId/")({
  beforeLoad: () => requireAnyRole(Role.DRIVER, Role.FLEET_MANAGER),
  component: TripDetailPage,
});
