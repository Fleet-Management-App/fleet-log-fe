import type { FC, ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/modules/common/components/ui/card";

type TripMessageCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

/** Centred message for the empty, empty-filter and error states of the trip screens. */
export const TripMessageCard: FC<TripMessageCardProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => (
  <Card>
    <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </CardContent>
  </Card>
);
