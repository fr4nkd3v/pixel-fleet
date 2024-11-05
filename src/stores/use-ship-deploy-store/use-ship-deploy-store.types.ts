import { TShipId, TOrientationType } from "~/types/game";

export interface IShipDeployStore {
  shipId: TShipId | null;
  orientation: TOrientationType;
  hasShipOnDeploy: boolean;
  setShipOnDeploy: (shipId: TShipId) => void;
  setOrientation: (orientation: TOrientationType) => void;
  clearShipOnDeploy: () => void;
}
