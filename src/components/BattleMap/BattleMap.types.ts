import { TCurrentShipDeploying, TCursorLocation, TMapCoordinates, TOrientationType } from "~/pages/GamePage/GamePage.types";

export interface IBattleMapProps {
  width: number;
  height: number;
  mapCoordinates: TMapCoordinates;
  currentShipDeploying: TCurrentShipDeploying;
  onDeployedShip: (shipId: string, locationX: string, locationY: string) => void;
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