import type { FC } from "react";

import { Card, CardContent, CardHeader } from "@/modules/common/components/ui/card";

const Bar: FC<{ className: string }> = ({ className }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

const CardSkeleton: FC<{ rows: number }> = ({ rows }) => (
  <Card>
    <CardHeader>
      <Bar className="h-5 w-32" />
    </CardHeader>
    <CardContent className="flex flex-col gap-3">
      {Array.from({ length: rows }, (_, index) => (
        <Bar key={index} className="h-4 w-full max-w-sm" />
      ))}
    </CardContent>
  </Card>
);

/** Same layout as the loaded detail, so nothing jumps when the trip arrives. */
export const TripDetailSkeleton: FC = () => (
  <div className="flex flex-col gap-6" aria-busy="true">
    <div className="flex flex-col gap-2">
      <Bar className="h-4 w-24" />
      <Bar className="h-8 w-56" />
      <Bar className="h-5 w-24" />
    </div>
    <Bar className="h-16 w-full" />
    <div className="grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="flex flex-col gap-6">
        <CardSkeleton rows={5} />
        <CardSkeleton rows={2} />
      </div>
      <CardSkeleton rows={2} />
    </div>
  </div>
);
