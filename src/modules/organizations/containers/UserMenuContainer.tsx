import type { FC } from "react";

import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { changeLanguage } from "@/config/i18n/i18n";
import type { Language } from "@/config/i18n/resources";
import { endSession } from "@/security/session";
import { useCurrentUser } from "@/security/useCurrentUser";

import { UserMenu } from "../components/UserMenu";

export const UserMenuContainer: FC = () => {
  const { fullName, email } = useCurrentUser();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleLogout = async () => {
    endSession();
    await navigate({ to: "/login" });
  };

  return (
    <UserMenu
      fullName={fullName}
      email={email}
      language={i18n.resolvedLanguage as Language}
      onLanguageChange={(language) => void changeLanguage(language)}
      onLogout={handleLogout}
    />
  );
};
