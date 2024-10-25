import { TOrientationType } from "~/types/game";

export const toggleOrientation = (orientation: TOrientationType) => {
  return orientation === "horizontal" ? "vertical" : "horizontal";
};
