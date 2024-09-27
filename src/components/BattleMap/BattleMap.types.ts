import type {
  TShipId,
  TOrientationType,
  TCurrentShipOnDeploy,
  TCursorLocation,
  TCoveredShip,
  TMap,
  TCoordinate
} from "~/types/game";

export interface IBattleMapProps {
  width: number;
  height: number;
  mapCoordinates: TMap;
  currentShipOnDeploy: TCurrentShipOnDeploy | null;
  disabled?: boolean;
  targetCoordinates: TCoordinate;
  isReady: boolean;
  onDeployedShip: (shipId: TShipId, locationX: string, locationY: number, orientation: TOrientationType) => void;
  onChangeOrientation: (orientation: TOrientationType) => void;
  onChangeCursorLocation: ({ x, y }: TCursorLocation) => void;
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
}