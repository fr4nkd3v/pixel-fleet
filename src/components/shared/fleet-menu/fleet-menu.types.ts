import { TShipId, TShip } from "~/types/game";

export interface IFleetMenuBaseProps {
  className?: string;
}

export interface IFleetMenuOpponentItemProps {
  shipData: TShip;
}

export interface IFleetMenuPlayerItemProps extends IFleetMenuOpponentItemProps {
  shipOnDeployId: TShipId | null;
}
