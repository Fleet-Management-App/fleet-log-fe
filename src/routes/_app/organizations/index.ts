import { createFileRoute } from "@tanstack/react-router";

import { OrganizationPickerPage } from "@/modules/organizations/pages/OrganizationPickerPage";

// Pick the organization to work in, accept an invitation, or go create one (FLOG-55)
export const Route = createFileRoute("/_app/organizations/")({
  staticData: { minimalLayout: true },
  component: OrganizationPickerPage,
});
