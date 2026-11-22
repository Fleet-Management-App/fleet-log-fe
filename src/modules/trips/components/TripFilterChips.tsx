import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { Button } from "@/modules/common/components/ui/button";

import { TRIP_FILTERS, type TripFilter } from "../utils/tripFilter";

type TripFilterChipsProps = {
  value: TripFilter;
  onChange: (filter: TripFilter) => void;
};

export const TripFilterChips: FC<TripFilterChipsProps> = ({ value, onChange }) => {
  const { t } = useTranslation("trips");

  return (
    <div role="group" aria-label={t("list.filterLabel")} className="flex flex-wrap gap-2">
      {TRIP_FILTERS.map((filter) => (
        <Button
          key={filter}
          size="sm"
          variant={filter === value ? "default" : "outline"}
          aria-pressed={filter === value}
          onClick={() => onChange(filter)}
        >
          {t(`list.filters.${filter}`)}
        </Button>
      ))}
    </div>
  );
};
