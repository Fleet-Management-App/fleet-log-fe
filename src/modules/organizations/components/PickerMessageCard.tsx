import type { FC, ReactNode } from "react";

import { Card, CardContent } from "@/modules/common/components/ui/card";

type PickerMessageCardProps = {
  title: string;
  description: string;
  action: ReactNode;
};

/** Centred message for the picker's empty and load-error states. */
export const PickerMessageCard: FC<PickerMessageCardProps> = ({ title, description, action }) => (
  <Card>
    <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </CardContent>
  </Card>
);
