import type { TCursorLocation, TCoordinates, TEmptyCoordinates } from "~/types";

export interface IBattleMapOpponentProps {
  className?: string;
  onFinishesShot: () => void;
}
export interface IBattleMapPlayerProps extends IBattleMapOpponentProps {
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}

export interface ISightProps {
  targetCoordinates: TCoordinates | TEmptyCoordinates;
  isShooting: boolean;
  isInTurn: boolean;
  onFinishesShot: () => void;
}
