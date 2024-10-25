import { type TShipId } from "~/types/game";

export interface IShipItemProps {
  shipId: TShipId;
  shipType: TShipId;
  fullHealth: number;
  currentHealth: number;
  isDeployed: boolean;
  onDeploying: (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => void;
  shipOnDeployId: TShipId | null;
}
