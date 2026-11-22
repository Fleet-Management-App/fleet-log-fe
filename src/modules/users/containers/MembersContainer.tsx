import type { FC } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getGetMeQueryKey } from "@/api/generated/hooks/account/account";
import {
  getListMembersQueryKey,
  useChangeMemberRoles,
  useListMembers,
  useRemoveMember,
} from "@/api/generated/hooks/organization-members/organization-members";
import { type MemberResponse, Role } from "@/api/generated/models";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";
import { useRoleLabels } from "@/modules/common/utils/roles";
import { useCurrentUser } from "@/security/useCurrentUser";

import { MembersTable } from "../components/MembersTable";

export const MembersContainer: FC = () => {
  const { id: currentUserId } = useCurrentUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: members = [], isLoading } = useListMembers();
  const { mutateAsync: changeRoles, isPending: isChangingRoles } = useChangeMemberRoles();
  const { mutateAsync: removeMember, isPending: isRemoving } = useRemoveMember();
  const { t } = useTranslation("users");
  const { formatRoles } = useRoleLabels();

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListMembersQueryKey() });

  // Your own change may take the Fleet Manager rights away; then this page is no longer yours
  const afterOwnChange = async (keepsFleetManager: boolean) => {
    await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    if (keepsFleetManager) await refresh();
    else await navigate({ to: "/" });
  };

  const handleRolesChange = async (member: MemberResponse, roles: Role[]) => {
    try {
      await changeRoles({ userId: member.userId, data: { roles } });
      toast.success(
        t("members.rolesChanged", { name: member.fullName, roles: formatRoles(roles) }),
      );
      if (member.userId === currentUserId) await afterOwnChange(roles.includes(Role.FLEET_MANAGER));
      else await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRemove = async (member: MemberResponse) => {
    try {
      await removeMember({ userId: member.userId });
      toast.success(t("members.removed", { name: member.fullName }));
      if (member.userId === currentUserId) await afterOwnChange(false);
      else await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <MembersTable
      members={members}
      currentUserId={currentUserId}
      isLoading={isLoading}
      disabled={isChangingRoles || isRemoving}
      onRolesChange={handleRolesChange}
      onRemove={handleRemove}
    />
  );
};
