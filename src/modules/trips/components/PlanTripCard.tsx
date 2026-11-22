import type { FC, ReactNode } from "react";

import { Card, CardContent } from "@/modules/common/components/ui/card";

// The bordered box every state of the plan screen sits in, so the page doesn't jump between them
export const PlanTripCard: FC<{ children: ReactNode }> = ({ children }) => (
  <Card>
    <CardContent className="py-2">{children}</CardContent>
  </Card>
);
