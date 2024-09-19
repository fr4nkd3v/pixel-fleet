import { TOrientationType } from "~/pages/GamePage/GamePage.types";

export interface ICursorShadowShipProps {
  length: number | null;
  isVisible: boolean;
  orientation?: TOrientationType;
  locationX: number;
  locationY: number;
}