import type { FC } from "react";

import { useNavigate } from "@tanstack/react-router";

import { endSession } from "@/security/session";
import { useCurrentUser } from "@/security/useCurrentUser";

import { UserMenu } from "../components/UserMenu";

export const UserMenuContainer: FC = () => {
  const { fullName, email } = useCurrentUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    endSession();
    await navigate({ to: "/login" });
  };

  return <UserMenu fullName={fullName} email={email} onLogout={handleLogout} />;
};
