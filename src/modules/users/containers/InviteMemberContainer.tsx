import type { FC } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getListInvitationsQueryKey,
  useCreateInvitation,
} from "@/api/generated/hooks/organization-members/organization-members";
import type { CreateInvitationRequest } from "@/api/generated/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { InviteMemberForm } from "../forms/InviteMemberForm/InviteMemberForm";

export const InviteMemberContainer: FC = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createInvitation } = useCreateInvitation();
  const { t } = useTranslation("users");

  // Resolves to true when the form should reset
  const handleInvite = async (data: CreateInvitationRequest) => {
    try {
      await createInvitation({ data });
      toast.success(t("invite.sent", { email: data.email }));
      await queryClient.invalidateQueries({ queryKey: getListInvitationsQueryKey() });
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("invite.title")}</CardTitle>
        <CardDescription>{t("invite.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <InviteMemberForm onSubmit={handleInvite} />
      </CardContent>
    </Card>
  );
};
