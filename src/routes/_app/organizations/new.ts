import { createFileRoute } from "@tanstack/react-router";

import { CreateOrganizationPage } from "@/modules/organizations/pages/CreateOrganizationPage";

// Create an organization; its creator becomes its first Fleet Manager (FLOG-55)
export const Route = createFileRoute("/_app/organizations/new")({
  staticData: { minimalLayout: true },
  component: CreateOrganizationPage,
});
