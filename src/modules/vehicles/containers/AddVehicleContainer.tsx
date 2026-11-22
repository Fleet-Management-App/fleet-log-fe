import { type FC, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getListVehiclesQueryKey, useCreateVehicle } from "@/api/generated/hooks/vehicles/vehicles";
import { ApiProblemCode, type VehicleCreateRequest } from "@/api/generated/models";
import { Button } from "@/modules/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/common/components/ui/dialog";
import {
  getErrorCode,
  getErrorField,
  getErrorMessage,
} from "@/modules/common/utils/getErrorMessage";

import {
  AddVehicleForm,
  type AddVehicleSubmitResult,
  type UniqueVehicleField,
} from "../forms/AddVehicleForm/AddVehicleForm";

// A duplicate is answered with 409 and the clashing field (plate or vin); the message goes on that field
const TAKEN_CODES: (ApiProblemCode | undefined)[] = [
  ApiProblemCode.VEHICLE_PLATE_TAKEN,
  ApiProblemCode.VEHICLE_VIN_TAKEN,
];
const isUniqueField = (field: string | undefined): field is UniqueVehicleField =>
  field === "plate" || field === "vin";

export const AddVehicleContainer: FC = () => {
  const { t } = useTranslation("vehicles");
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutateAsync: createVehicle } = useCreateVehicle();

  const handleAdd = async (data: VehicleCreateRequest): Promise<AddVehicleSubmitResult> => {
    try {
      // The BE normalises plate and VIN, so the toast names the plate as it was stored
      const vehicle = await createVehicle({ data });
      toast.success(t("form.added", { plate: vehicle.plate }));
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
      return { success: true };
    } catch (error) {
      const field = getErrorField(error);
      if (TAKEN_CODES.includes(getErrorCode(error)) && isUniqueField(field))
        return { success: false, fieldErrors: { [field]: getErrorMessage(error) } };
      toast.error(getErrorMessage(error));
      return { success: false };
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          {t("page.add")}
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("form.title")}</DialogTitle>
          <DialogDescription>{t("form.description")}</DialogDescription>
        </DialogHeader>
        {/* The dialog unmounts its content when closed, so every opening starts with an empty form */}
        <AddVehicleForm onSubmit={handleAdd} />
      </DialogContent>
    </Dialog>
  );
};
