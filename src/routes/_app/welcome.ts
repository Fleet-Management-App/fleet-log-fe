import { createFileRoute } from "@tanstack/react-router";

import { WelcomePage } from "@/modules/organizations/pages/WelcomePage";

export const Route = createFileRoute("/_app/welcome")({
  component: WelcomePage,
});
