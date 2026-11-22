import { createFileRoute } from "@tanstack/react-router";

import { Role } from "@/api/generated/models";
import { ApprovalsPage } from "@/modules/approvals/pages/ApprovalsPage";
import { requireAnyRole } from "@/security/requireRole";

// Fleet Managers only: trip plan and fuel approval queues (FLOG-60)
export const Route = createFileRoute("/_app/approvals")({
  beforeLoad: () => requireAnyRole(Role.FLEET_MANAGER),
  component: ApprovalsPage,
});
