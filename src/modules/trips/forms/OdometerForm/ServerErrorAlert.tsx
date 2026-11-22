import type { FC } from "react";

import { CircleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/modules/common/components/ui/alert";

// The BE's answer when saving failed (e.g. a 400 for BR-04 or a 409), shown above the submit button
export const ServerErrorAlert: FC<{ title: string; message?: string }> = ({ title, message }) =>
  message ? (
    <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
      <CircleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  ) : null;
