import { type TShipId } from "~/types/game";

export interface IShipItemProps {
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
