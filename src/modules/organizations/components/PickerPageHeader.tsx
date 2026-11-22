import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

type PickerPageHeaderProps = {
  title: string;
  description: string;
  // The create page links back to the picker
  showBackLink?: boolean;
};

export const PickerPageHeader: FC<PickerPageHeaderProps> = ({
  title,
  description,
  showBackLink = false,
}) => {
  const { t } = useTranslation("organizations");

  return (
    <div className="flex flex-col gap-1">
      {showBackLink && (
        <Link
          to="/organizations"
          className="flex w-fit items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {t("create.back")}
        </Link>
      )}
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
