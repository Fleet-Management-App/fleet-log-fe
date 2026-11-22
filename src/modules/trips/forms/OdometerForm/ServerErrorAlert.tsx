import type { FC } from "react";

import { CircleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/modules/common/components/ui/alert";

// Why saving failed (the BE's error code, translated), shown above the submit button when the
// error is not about one of the form's fields
export const ServerErrorAlert: FC<{ title: string; message?: string }> = ({ title, message }) =>
  message ? (
    <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
      <CircleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  ) : null;
