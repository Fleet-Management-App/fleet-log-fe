import type { FC, ReactNode } from "react";

import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/modules/common/components/ui/card";

type LogTripShellProps = {
  tripId: string;
  title: string;
  description: string;
  children: ReactNode;
};

// Page frame of the odometer and fuel screens: back to the trip detail, heading, one card
export const LogTripShell: FC<LogTripShellProps> = ({ tripId, title, description, children }) => {
  const { t } = useTranslation("tripLog");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Link
          to="/trips/$tripId"
          params={{ tripId }}
          className="flex w-fit items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {t("backToDetail")}
        </Link>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-5">{children}</CardContent>
      </Card>
    </div>
  );
};
