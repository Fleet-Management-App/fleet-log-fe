import type { FC } from "react";

import { toast } from "sonner";

import { useCreateOrganization } from "@/api/generated/hooks/organizations/organizations";
import type { CreateOrganizationRequest } from "@/api/generated/models";
import { useStartSession } from "@/modules/auth/hooks/custom/useStartSession";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { CreateOrganizationForm } from "../forms/CreateOrganizationForm/CreateOrganizationForm";

export const CreateOrganizationContainer: FC = () => {
  const { mutateAsync: createOrganization } = useCreateOrganization();
  const startSession = useStartSession();

  const handleCreate = async (data: CreateOrganizationRequest) => {
    try {
      // The BE answers with a token for the new organization, with the caller as its Fleet Manager
      await startSession(await createOrganization({ data }));
      toast.success(`${data.name} is ready. Invite your drivers next.`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an organization</CardTitle>
        <CardDescription>You become its first Fleet Manager.</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateOrganizationForm onSubmit={handleCreate} />
      </CardContent>
    </Card>
  );
};
