import type { FC } from "react";

import { toast } from "sonner";

import { useSwitchOrganization } from "@/api/generated/hooks/auth/auth";
import { useStartSession } from "@/modules/auth/hooks/custom/useStartSession";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";
import { useCurrentUser } from "@/security/useCurrentUser";

import { OrganizationSwitcher } from "../components/OrganizationSwitcher";

export const OrganizationSwitcherContainer: FC = () => {
  const { activeOrganization, memberships, pendingInvitations } = useCurrentUser();
  const { mutateAsync: switchOrganization, isPending } = useSwitchOrganization();
  const startSession = useStartSession();

  const handleSwitch = async (organizationId: string) => {
    try {
      await startSession(await switchOrganization({ data: { organizationId } }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <OrganizationSwitcher
      active={activeOrganization ?? undefined}
      memberships={memberships}
      pendingInvitationCount={pendingInvitations.length}
      disabled={isPending}
      onSwitch={handleSwitch}
    />
  );
};
