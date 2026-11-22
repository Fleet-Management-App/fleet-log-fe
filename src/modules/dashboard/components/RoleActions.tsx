import type { FC } from "react";

import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/modules/common/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { cn } from "@/modules/common/lib/utils";

import type { RoleAction } from "../models/roleActions";

const ActionCard: FC<{ action: RoleAction }> = ({ action: { id, icon: Icon, to } }) => {
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <Card className={cn("h-full transition-colors", to ? "hover:bg-muted/50" : "opacity-70")}>
      <CardHeader>
        <Icon className="mb-2 size-5 text-primary" />
        <CardTitle>{t(`actions.${id}.title`)}</CardTitle>
        <CardDescription>{t(`actions.${id}.description`)}</CardDescription>
        {!to && (
          <CardAction>
            <Badge variant="outline">{t("common:states.comingSoon")}</Badge>
          </CardAction>
        )}
      </CardHeader>
    </Card>
  );
};

export const RoleActions: FC<{ actions: RoleAction[] }> = ({ actions }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {actions.map((action, index) => (
      <motion.div
        key={action.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.04 }}
      >
        {action.to ? (
          <Link to={action.to} className="block h-full">
            <ActionCard action={action} />
          </Link>
        ) : (
          <ActionCard action={action} />
        )}
      </motion.div>
    ))}
  </div>
);
