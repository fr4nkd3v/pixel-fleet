import { TCoveredShip, TCursorLocation, TCoordinates } from "~/types";

export interface ITileOpponentProps {
  indexes: TCoordinates;
  isCovered: false | TCoveredShip;
  isAttacked: boolean;
}

export interface ITilePlayerProps extends ITileOpponentProps {
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}
