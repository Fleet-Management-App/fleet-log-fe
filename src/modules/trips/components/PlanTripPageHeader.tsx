import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const PlanTripPageHeader: FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1">
      <Link
        to="/trips"
        className="mb-1 inline-flex w-fit items-center gap-1 text-sm text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-3.5" />
        {t("nav.myTrips")}
      </Link>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
};
