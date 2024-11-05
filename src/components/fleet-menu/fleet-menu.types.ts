import { TShipId, TFleet } from "~/types/game";

export interface IFleetMenuProps {
  shipList: TFleet;
  primaryText: string;
  secondaryText: string;
  onDeployingShip: (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => void;
  shipOnDeployId: TShipId | null;
}
