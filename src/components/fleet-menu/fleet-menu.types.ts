import { TShipId, TCursorLocation, TShip, TPerspective } from "~/types/game";

export interface IFleetMenuProps {
  perspective: TPerspective;
  setCursorLocation?: (cursorLocation: TCursorLocation) => void;
}

export interface IFleetMenuItemProps {
  shipData: TShip;
  isHidden?: boolean;
  shipOnDeployId: TShipId | null;
  onDeploying: (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => void;
}
