import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/modules/common/components/ui/button";

export const NotFoundPage: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">{t("notFound.title")}</h1>
      <Button asChild variant="outline">
        <Link to="/">{t("notFound.backToDashboard")}</Link>
      </Button>
    </div>
  );
};
