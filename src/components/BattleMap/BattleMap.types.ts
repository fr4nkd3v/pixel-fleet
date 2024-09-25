import type { TShipId, TOrientationType, TCurrentShipOnDeploy, TCursorLocation, TCoveredShip, TMap } from "~/types/game";

export interface IBattleMapProps {
  width: number;
  height: number;
  mapCoordinates: TMap;
  currentShipOnDeploy: TCurrentShipOnDeploy | null;
  disabled?: boolean;
  onDeployedShip: (shipId: TShipId, locationX: string, locationY: number, orientation: TOrientationType) => void;
  onChangeOrientation: (orientation: TOrientationType) => void;
  onChangeCursorLocation: ({ x, y }: TCursorLocation) => void;
}

export interface ITileProps {
  locationX: number;
  locationY: number;
  isCovered: false | TCoveredShip;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
}