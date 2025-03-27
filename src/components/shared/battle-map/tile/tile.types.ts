import { TCoveredShip, TCursorLocation } from "~/types";

export interface ITileOpponentProps {
  coordinateX: string;
  coordinateY: number;
  isCovered: false | TCoveredShip;
  isAttacked: boolean;
}

export interface ITilePlayerProps extends ITileOpponentProps {
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}
