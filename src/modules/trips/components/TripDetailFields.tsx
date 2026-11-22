import type { FC, ReactNode } from "react";

export type TripDetailField = { label: string; value: ReactNode };

/** Label/value rows used by the detail cards (uppercase label on the left, as in Figma). */
export const TripDetailFields: FC<{ fields: TripDetailField[] }> = ({ fields }) => (
  <dl className="grid grid-cols-[minmax(6rem,8rem)_1fr] gap-x-4 gap-y-3 text-sm">
    {fields.map(({ label, value }) => (
      <div key={label} className="contents">
        <dt className="self-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </dt>
        <dd className="min-w-0 break-words">{value}</dd>
      </div>
    ))}
  </dl>
);
