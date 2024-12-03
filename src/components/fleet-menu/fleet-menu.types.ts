import { TShipId, TFleet } from "~/types/game";

export interface IFleetMenuProps {
  shipList: TFleet;
  primaryText: string;
  secondaryText: string;
  shipOnDeployId: TShipId | null;
  isHidden?: boolean;
  onDeployingShip: (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => void;
}

export interface IFleetMenuItemProps {
  shipId: TShipId;
  shipType: TShipId;
  fullHealth: number;
  currentHealth: number;
  isDeployed: boolean;
  shipOnDeployId: TShipId | null;
  isHidden?: boolean;
  onDeploying: (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => void;
}
