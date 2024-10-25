import { TShipId, TOrientationType, TCursorLocation } from "~/types/game";

export interface IShipDeployStore {
  shipId: TShipId | null;
  orientation: TOrientationType | null;
  cursorLocation: TCursorLocation | null;
  setShipOnDeploy: (
    shipId: TShipId,
    orientation: TOrientationType,
    cursorLocation: TCursorLocation
  ) => void;
  setOrientation: (orientation: TOrientationType) => void;
  setCursorLocation: (cursorLocation: TCursorLocation) => void;
  clearShipOnDeploy: () => void;
}
