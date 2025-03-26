import { TShipId, TCursorLocation, TShip } from "~/types/game";

export interface IFleetMenuPlayerProps {
  className?: string;
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}
export interface IFleetMenuOpponentProps {
  className?: string;
}

export interface IFleetMenuPlayerItemProps {
  shipData: TShip;
  shipOnDeployId: TShipId | null;
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}

export interface IFleetMenuOpponentItemProps {
  shipData: TShip;
}
