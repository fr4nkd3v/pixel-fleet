import type { TCoordinates, TEmptyCoordinates } from "~/types";

export interface IBattleMapBaseProps {
  className?: string;
  onFinishesShot: () => void;
}

export interface ISightProps {
  targetCoordinates: TCoordinates | TEmptyCoordinates;
  isShooting: boolean;
  isInTurn: boolean;
  onFinishesShot: () => void;
}
