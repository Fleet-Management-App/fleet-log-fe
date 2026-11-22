import type { FC, ReactNode } from "react";

import { PlanTripCard } from "./PlanTripCard";

type PlanTripMessageProps = {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  // Buttons or links under the text
  actions?: ReactNode;
};

// Shown in place of the form: no vehicles, a load failure, or a plan that can't be edited
export const PlanTripMessage: FC<PlanTripMessageProps> = ({ icon, title, children, actions }) => (
  <PlanTripCard>
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{title}</p>
        {children && <div className="text-sm text-muted-foreground">{children}</div>}
      </div>
      {actions && <div className="flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  </PlanTripCard>
);
