import { type FC, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getListVehiclesQueryKey, useCreateVehicle } from "@/api/generated/hooks/vehicles/vehicles";
import type { ProblemDetail, VehicleCreateRequest } from "@/api/generated/models";
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
  AddVehicleForm,
  type AddVehicleSubmitResult,
} from "../forms/AddVehicleForm/AddVehicleForm";

export const AddVehicleContainer: FC = () => {
  const { t } = useTranslation("vehicles");
  const { t: tCommon } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutateAsync: createVehicle } = useCreateVehicle();

  const handleAdd = async (data: VehicleCreateRequest): Promise<AddVehicleSubmitResult> => {
    try {
      await createVehicle({ data });
      toast.success(t("form.added", { plate: data.plate }));
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
      return { success: true };
    } catch (error) {
      const response = (error as AxiosError<ProblemDetail>)?.response;
      // The 409 detail names the clashing field in English (VehicleService.create)
      if (response?.status === 409) {
        const detail = response.data?.detail ?? "";
        if (detail.includes("VIN"))
          return { success: false, fieldErrors: { vin: t("form.errors.vinTaken") } };
        if (detail.includes("plate"))
          return { success: false, fieldErrors: { plate: t("form.errors.plateTaken") } };
      }
      toast.error(tCommon("states.actionError"));
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
