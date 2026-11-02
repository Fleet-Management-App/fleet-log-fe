import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { hasSession } from "@/security/session";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (hasSession()) throw redirect({ to: "/" });
  },
  component: LoginPage,
});
