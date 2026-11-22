import type { FC } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useCreateOrganization } from "@/api/generated/hooks/organizations/organizations";
import type { CreateOrganizationRequest } from "@/api/generated/models";
import { useStartSession } from "@/modules/auth/hooks/custom/useStartSession";
import { Card, CardContent } from "@/modules/common/components/ui/card";

import { CreateOrganizationForm } from "../forms/CreateOrganizationForm/CreateOrganizationForm";

export const CreateOrganizationContainer: FC = () => {
  const { mutateAsync: createOrganization } = useCreateOrganization();
  const startSession = useStartSession();
  const { t } = useTranslation("organizations");

  // A failure is left to the form, which shows it
  const handleCreate = async (data: CreateOrganizationRequest) => {
    // The BE answers with a token for the new organization, with the caller as its Fleet Manager
    const session = await createOrganization({ data });
    toast.success(t("create.created", { name: data.name }));
    await startSession(session);
  };

  return (
    <Card>
      <CardContent>
        <CreateOrganizationForm onSubmit={handleCreate} />
      </CardContent>
    </Card>
  );
};
