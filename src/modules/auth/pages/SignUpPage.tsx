import type { FC } from "react";

import { Link } from "@tanstack/react-router";

import { AuthLayout } from "@/modules/common/layout/AuthLayout";

import { SignUpContainer } from "../containers/SignUpContainer";

export const SignUpPage: FC = () => (
  <AuthLayout
    title="Create your account"
    description="Next you create an organization, or join one that invited you."
    footer={
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
          Log in
        </Link>
      </p>
    }
  >
    <SignUpContainer />
  </AuthLayout>
);
