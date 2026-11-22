import type { FC } from "react";

export const ApprovalsEmptyState: FC<{ title: string; text: string }> = ({ title, text }) => (
  <div className="flex min-h-56 flex-col items-center justify-center gap-1 rounded-lg border px-4 py-12 text-center">
    <p className="font-semibold">{title}</p>
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);
