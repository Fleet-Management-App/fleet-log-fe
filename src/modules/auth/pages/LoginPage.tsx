import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AuthLayout } from "@/modules/common/layout/AuthLayout";

import { LoginContainer } from "../containers/LoginContainer";

export const LoginPage: FC = () => {
  const { t } = useTranslation("auth");

  return (
    <AuthLayout
      title={t("login.title")}
      description={t("login.description")}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          {t("login.noAccount")}{" "}
          <Link to="/sign-up" className="font-medium text-foreground underline underline-offset-4">
            {t("login.signUpLink")}
          </Link>
        </p>
      }
    >
      <LoginContainer />
    </AuthLayout>
  );
};
