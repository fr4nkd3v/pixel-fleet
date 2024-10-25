import { TShipId, TFleet } from "~/types/game";

export interface IFleetMenuProps {
  shipList: TFleet;
  onDeployingShip: (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => void;
  shipOnDeployId: TShipId | null;
}
