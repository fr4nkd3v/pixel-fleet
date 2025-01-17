import type {
  TCoveredShip,
  TCoordinate,
  TEmptyCoordinate,
  TPerspective,
} from "~/types";

export interface IBattleMapProps {
  perspective: TPerspective;
  className?: string;
  onFinishesShot: () => void;
}

export interface ITileProps {
  locationX: number;
  locationY: number;
  isCovered: false | TCoveredShip;
  isAttacked: boolean;
  perspective: TPerspective;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}

export interface ISightProps {
  targetCoordinates: TCoordinate | TEmptyCoordinate;
  isShooting: boolean;
  isInTurn: boolean;
  onFinishesShot: () => void;
}
