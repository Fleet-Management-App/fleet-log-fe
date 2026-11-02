import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignUpPage } from "@/modules/auth/pages/SignUpPage";
import { hasSession } from "@/security/session";

export const Route = createFileRoute("/sign-up")({
  beforeLoad: () => {
    if (hasSession()) throw redirect({ to: "/" });
  },
  component: SignUpPage,
});
