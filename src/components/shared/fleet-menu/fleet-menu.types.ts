import { TShipId, TCursorLocation, TShip, TPerspective } from "~/types/game";

export interface IFleetMenuProps {
  perspective: TPerspective;
  className?: string;
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}

export interface IFleetMenuItemProps {
  shipData: TShip;
  perspective: TPerspective;
  shipOnDeployId: TShipId | null;
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}
