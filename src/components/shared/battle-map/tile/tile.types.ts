import { TCoveredShip, TCursorLocation, TCoordinates } from "~/types";

export interface ITileOpponentProps {
  coordinates: TCoordinates;
  isCovered: false | TCoveredShip;
  isAttacked: boolean;
}

export interface ITilePlayerProps extends ITileOpponentProps {
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}
