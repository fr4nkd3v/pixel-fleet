import type {
  TCoveredShip,
  TCoordinate,
  TEmptyCoordinate,
  TPerspective,
  TCursorLocation,
} from "~/types";

export interface IBattleMapProps {
  perspective: TPerspective;
  className?: string;
  onFinishesShot: () => void;
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}

export interface ITileProps {
  coordinateX: string;
  coordinateY: number;
  isCovered: false | TCoveredShip;
  isAttacked: boolean;
  perspective: TPerspective;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}

export interface ISightProps {
  targetCoordinates: TCoordinate | TEmptyCoordinate;
  isShooting: boolean;
  isInTurn: boolean;
  onFinishesShot: () => void;
}
