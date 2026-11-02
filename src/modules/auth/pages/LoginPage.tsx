import type { FC } from "react";

import { Link } from "@tanstack/react-router";

import { AuthLayout } from "@/modules/common/layout/AuthLayout";

import { LoginContainer } from "../containers/LoginContainer";

export const LoginPage: FC = () => (
  <AuthLayout
    title="Log in"
    description="One account for every organization you work with."
    footer={
      <p className="text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link to="/sign-up" className="font-medium text-foreground underline underline-offset-4">
          Sign up
        </Link>
      </p>
    }
  >
    <LoginContainer />
  </AuthLayout>
);
