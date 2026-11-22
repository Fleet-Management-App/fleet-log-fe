import type { FC } from "react";

import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { useCurrentUser } from "@/security/useCurrentUser";

import { CreateOrganizationContainer } from "../containers/CreateOrganizationContainer";
import { PendingInvitationsContainer } from "../containers/PendingInvitationsContainer";

// Where a user without an organization lands, and where anyone can create or join another one.
export const WelcomePage: FC = () => {
  const { fullName, activeOrganization } = useCurrentUser();
  const { t } = useTranslation("organizations");

  return (
    <motion.div
      className="mx-auto flex max-w-3xl flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">
          {activeOrganization
            ? t("createOrJoin")
            : t("welcome.title", { firstName: fullName.split(" ")[0] })}
        </h1>
        <p className="text-sm text-muted-foreground">{t("welcome.description")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <PendingInvitationsContainer />
        <CreateOrganizationContainer />
      </div>
    </motion.div>
  );
};
