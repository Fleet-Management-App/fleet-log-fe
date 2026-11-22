import type { FC } from "react";

import { useParams } from "@tanstack/react-router";

import { TripDetailContainer } from "../containers/TripDetailContainer";

export const TripDetailPage: FC = () => {
  const { tripId } = useParams({ from: "/_app/trips/$tripId/" });
  // Keyed by id so the cancel confirmation doesn't carry over to another trip
  return <TripDetailContainer key={tripId} tripId={tripId} />;
};
