import type { FC } from "react";

import { OrganizationPickerContainer } from "../containers/OrganizationPickerContainer";

// Where a user lands after login when there is something to choose, and where anyone can switch
// organization, answer an invitation or go create an organization (FLOG-55)
export const OrganizationPickerPage: FC = () => (
  <div className="mx-auto w-full max-w-md">
    <OrganizationPickerContainer />
  </div>
);
