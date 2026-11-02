import type { FC } from "react";

import { toast } from "sonner";

import { useLogin } from "@/api/generated/hooks/auth/auth";
import type { LoginRequest } from "@/api/generated/models";
import { EnvVariableName, getEnvVariable } from "@/config/env/getEnvVariable";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { DemoAccounts } from "../components/DemoAccounts";
import { LoginForm } from "../forms/LoginForm/LoginForm";
import { useStartSession } from "../hooks/custom/useStartSession";

const isDemoMode = getEnvVariable(EnvVariableName.DEMO_MODE, undefined, false) === "true";

export const LoginContainer: FC = () => {
  const { mutateAsync: login, isPending } = useLogin();
  const startSession = useStartSession();

  const handleLogin = async (data: LoginRequest) => {
    try {
      await startSession(await login({ data }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <LoginForm onSubmit={handleLogin} />
      {isDemoMode && <DemoAccounts disabled={isPending} onPick={handleLogin} />}
    </div>
  );
};
