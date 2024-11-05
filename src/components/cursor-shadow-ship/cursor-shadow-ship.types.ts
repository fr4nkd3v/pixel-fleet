import { TOrientationType } from "~/types";

export interface ICursorShadowShipProps {
  length: number | null;
  orientation?: TOrientationType;
  locationX: number;
  locationY: number;
}
