import type { FC, ReactNode } from "react";

import { CarFront } from "lucide-react";
import { motion } from "motion/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

// Centered card for the pages a signed-out user sees (login, sign-up).
export const AuthLayout: FC<AuthLayoutProps> = ({ title, description, children, footer }) => (
  <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 px-4 py-10">
    <div className="flex items-center gap-2 text-lg font-semibold">
      <CarFront className="size-6 text-primary" />
      FleetLog
    </div>
    <motion.div
      className="w-full max-w-sm"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
    {footer && <div className="w-full max-w-sm">{footer}</div>}
  </div>
);
