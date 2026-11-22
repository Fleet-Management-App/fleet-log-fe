import type { FC } from "react";

import { useTranslation } from "react-i18next";

import { PickerPageHeader } from "../components/PickerPageHeader";
import { CreateOrganizationContainer } from "../containers/CreateOrganizationContainer";

export const CreateOrganizationPage: FC = () => {
  const { t } = useTranslation("organizations");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <PickerPageHeader
        title={t("create.title")}
        description={t("create.description")}
        showBackLink
      />
      <CreateOrganizationContainer />
    </div>
  );
};
