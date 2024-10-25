import { create } from "zustand";
import { TShipId, TOrientationType, TCursorLocation } from "~/types/game";
import { IShipDeployStore } from "./use-ship-deploy-store.types";
import { DEFAULT_ORIENTATION } from "~/constants/game";

export const useShipDeployStore = create<IShipDeployStore>((set) => ({
  shipId: null,
  orientation: DEFAULT_ORIENTATION,
  cursorLocation: null,
  hasShipOnDeploy: false,
  setShipOnDeploy: (shipId: TShipId, cursorLocation: TCursorLocation) =>
    set({
      shipId,
      cursorLocation,
      orientation: DEFAULT_ORIENTATION,
      hasShipOnDeploy: true,
    }),
  setOrientation: (orientation: TOrientationType) => set({ orientation }),
  setCursorLocation: (cursorLocation: TCursorLocation) =>
    set({ cursorLocation }),
  clearShipOnDeploy: () => set({ shipId: null, hasShipOnDeploy: false }),
}));
