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

export interface IFleetMenuItemProps {
  shipId: TShipId;
  shipType: TShipId;
  fullHealth: number;
  currentHealth: number;
  isDeployed: boolean;
  shipOnDeployId: TShipId | null;
  onDeploying: (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => void;
}
