import type {
  TShipId,
  TOrientationType,
  TShipOnDeploy,
  TCursorLocation,
  TCoveredShip,
  TMap,
  TCoordinate,
} from "~/types/game";

export interface IBattleMapProps {
  mapCoordinates: TMap;
  currentShipOnDeploy: TShipOnDeploy;
  disabled?: boolean;
  targetCoordinates: TCoordinate | null;
  isReady: boolean;
  isShooting: boolean;
  isInTurn: boolean;
  onDeployedShip: (
    shipId: TShipId,
    locationX: string,
    locationY: number,
    orientation: TOrientationType
  ) => void;
  onChangeOrientation: (orientation: TOrientationType) => void;
  onChangeCursorLocation: ({ left, top }: TCursorLocation) => void;
  onFinishesShot: () => void;
}

export interface ITileProps {
  locationX: number;
  locationY: number;
  isCovered: false | TCoveredShip;
  isAttacked: boolean;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}

export interface ISightProps {
  targetCoordinates: TCoordinate;
  isShooting: boolean;
  isInTurn: boolean;
  onFinishesShot: () => void;
}
