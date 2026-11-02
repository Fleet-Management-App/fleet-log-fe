import type { FC } from "react";

import { toast } from "sonner";

import { useSignUp } from "@/api/generated/hooks/auth/auth";
import type { SignUpRequest } from "@/api/generated/models";
import { getErrorMessage } from "@/modules/common/utils/getErrorMessage";

import { SignUpForm } from "../forms/SignUpForm/SignUpForm";
import { useStartSession } from "../hooks/custom/useStartSession";

export const SignUpContainer: FC = () => {
  const { mutateAsync: signUp } = useSignUp();
  const startSession = useStartSession();

  const handleSignUp = async (data: SignUpRequest) => {
    try {
      await startSession(await signUp({ data }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return <SignUpForm onSubmit={handleSignUp} />;
};
