import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { Badge } from "@/modules/common/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import { cn } from "@/modules/common/lib/utils";
import { formatDate } from "@/modules/common/utils/formatDate";

import { getVehicleLabel, type VehicleAvailability } from "../utils/vehicleAvailability";

const GREEN = "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300";
const AMBER = "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
const RED = "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";

// Picks the chip for a row: why it is blocked (BR-01), else the vignette state at the trip's date (BR-02)
const useBadge = ({ blockReason, vignetteState, vehicle }: VehicleAvailability) => {
  const { t } = useTranslation("tripPlan");
  if (blockReason)
    return {
      label: t(`vehiclePicker.blockReason.${blockReason}`),
      className: "bg-muted text-muted-foreground",
    };
  if (vignetteState === "VALID")
    return { label: t("vehiclePicker.vignetteValid"), className: GREEN };
  if (vignetteState === "EXPIRING")
    return {
      label: t("vehiclePicker.vignetteExpiring", {
        date: formatDate(`${vehicle.vignetteDueDate}T00:00`),
      }),
      className: AMBER,
    };
  if (vignetteState === "EXPIRED")
    return { label: t("vehiclePicker.vignetteExpired"), className: RED };
  return undefined;
};

const VehiclePickerBadge: FC<{ availability: VehicleAvailability }> = ({ availability }) => {
  const badge = useBadge(availability);
  if (!badge) return null;
  return (
    <Badge variant="secondary" className={cn("ml-auto shrink-0 rounded-sm", badge.className)}>
      {badge.label}
    </Badge>
  );
};

type VehiclePickerProps = {
  id: string;
  vehicles: VehicleAvailability[];
  value: string;
  onChange: (vehicleId: string) => void;
  onBlur: () => void;
  // The pool is only offered once the trip has a date
  disabled: boolean;
  invalid: boolean;
};

export const VehiclePicker: FC<VehiclePickerProps> = ({
  id,
  vehicles,
  value,
  onChange,
  onBlur,
  disabled,
  invalid,
}) => {
  const { t } = useTranslation("tripPlan");
  const selected = vehicles.find((availability) => availability.vehicle.id === value);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      onOpenChange={(open) => !open && onBlur()}
      disabled={disabled}
    >
      <SelectTrigger id={id} aria-invalid={invalid} className="w-full">
        <SelectValue
          placeholder={
            disabled ? t("vehiclePicker.chooseDateFirst") : t("vehiclePicker.placeholder")
          }
        >
          {selected && getVehicleLabel(selected.vehicle)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper">
        {vehicles.map((availability) => {
          const { vehicle, blockReason } = availability;
          return (
            <SelectItem
              key={vehicle.id}
              value={vehicle.id}
              disabled={!!blockReason}
              className="py-2 *:[span]:last:flex-1"
            >
              <div className="flex w-full items-center gap-3">
                <div className="flex flex-col">
                  <span>
                    {vehicle.make} {vehicle.model}
                  </span>
                  <span className="text-xs text-muted-foreground">{vehicle.plate}</span>
                </div>
                <VehiclePickerBadge availability={availability} />
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
