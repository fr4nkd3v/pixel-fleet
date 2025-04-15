import { TCoveredShip, TCoordinates } from "~/types";

export interface ITileBaseProps {
  indexes: TCoordinates;
  isCovered: false | TCoveredShip;
  isAttacked: boolean;
}
