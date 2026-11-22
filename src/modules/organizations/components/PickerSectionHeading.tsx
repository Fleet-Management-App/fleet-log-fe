import type { FC } from "react";

export const PickerSectionHeading: FC<{ children: string }> = ({ children }) => (
  <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
    {children}
  </h2>
);
