import { TShipId, TOrientationType, TCursorLocation } from "~/types/game";

export interface IShipDeployStore {
  shipId: TShipId | null;
  orientation: TOrientationType;
  cursorLocation: TCursorLocation | null;
  hasShipOnDeploy: boolean;
  setShipOnDeploy: (shipId: TShipId, cursorLocation: TCursorLocation) => void;
  setOrientation: (orientation: TOrientationType) => void;
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
  clearShipOnDeploy: () => void;
}
