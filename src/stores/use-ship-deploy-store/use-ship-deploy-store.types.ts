import { TShipId, TOrientationType } from "~/types/game";

export interface IShipDeployStore {
  shipId: TShipId | null;
  orientation: TOrientationType;
  hasShipOnDeploy: boolean;
  setShipOnDeploy: (shipId: TShipId, orientation?: TOrientationType) => void;
  setOrientation: (orientation: TOrientationType) => void;
  clearShipOnDeploy: () => void;
  restartState: () => void;
}
