import type { TMapCoordinate, TShipId, TOrientationType, TCurrentShipOnDeploy, TCursorLocation } from "~/types/game";

export interface IBattleMapProps {
  width: number;
  height: number;
  mapCoordinates: TMapCoordinate[];
  currentShipOnDeploy: TCurrentShipOnDeploy | null;
  onDeployedShip: (shipId: TShipId, locationX: string, locationY: string) => void;
  onChangeOrientation: (orientation: TOrientationType) => void;
  onChangeCursorLocation: ({ x, y }: TCursorLocation) => void;
}

export interface ITileProps {
  locationX: number;
  locationY: number;
  isCovered: boolean;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}