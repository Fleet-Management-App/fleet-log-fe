import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AuthLayout } from "@/modules/common/layout/AuthLayout";

import { SignUpContainer } from "../containers/SignUpContainer";

export const SignUpPage: FC = () => {
  const { t } = useTranslation("auth");

  return (
    <AuthLayout
      title={t("signUp.title")}
      description={t("signUp.description")}
      footer={
        <p className="text-center text-sm text-muted-foreground">
          {t("signUp.haveAccount")}{" "}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            {t("signUp.logInLink")}
          </Link>
        </p>
      }
    >
      <SignUpContainer />
    </AuthLayout>
  );
};
