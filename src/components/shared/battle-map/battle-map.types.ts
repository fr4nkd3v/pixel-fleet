import type { TCoordinate, TEmptyCoordinate, TCursorLocation } from "~/types";

export interface IBattleMapOpponentProps {
  className?: string;
  onFinishesShot: () => void;
}
export interface IBattleMapPlayerProps extends IBattleMapOpponentProps {
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}

export interface ISightProps {
  targetCoordinates: TCoordinate | TEmptyCoordinate;
  isShooting: boolean;
  isInTurn: boolean;
  onFinishesShot: () => void;
}
