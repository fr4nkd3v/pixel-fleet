import { TShipId, TCursorLocation, TShip } from "~/types/game";

export interface IFleetMenuOpponentProps {
  className?: string;
}

export interface IFleetMenuPlayerProps extends IFleetMenuOpponentProps {
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}

export interface IFleetMenuOpponentItemProps {
  shipData: TShip;
}

export interface IFleetMenuPlayerItemProps extends IFleetMenuOpponentItemProps {
  shipOnDeployId: TShipId | null;
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
}
