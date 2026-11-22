import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { useCurrentUser } from "@/security/useCurrentUser";

import { InviteMemberContainer } from "../containers/InviteMemberContainer";
import { MembersContainer } from "../containers/MembersContainer";
import { SentInvitationsContainer } from "../containers/SentInvitationsContainer";

export const MembersPage: FC = () => {
  const { activeOrganization } = useCurrentUser();
  const { t } = useTranslation("users");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{t("page.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("page.description", { organization: activeOrganization?.organizationName })}
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <MembersContainer />
          <SentInvitationsContainer />
        </div>
        <InviteMemberContainer />
      </div>
    </div>
  );
};
