import { create } from "zustand";
import { IShipDeployStore } from "./use-ship-deploy-store.types";
import { DEFAULT_ORIENTATION } from "~/constants/game";

export const useShipDeployStore = create<IShipDeployStore>((set) => ({
  shipId: null,
  orientation: DEFAULT_ORIENTATION,
  hasShipOnDeploy: false,
  setShipOnDeploy: (shipId) =>
    set({
      shipId,
      orientation: DEFAULT_ORIENTATION,
      hasShipOnDeploy: true,
    }),
  setOrientation: (orientation) => set({ orientation }),
  clearShipOnDeploy: () => set({ shipId: null, hasShipOnDeploy: false }),
  restartState: () =>
    set({
      shipId: null,
      orientation: DEFAULT_ORIENTATION,
      hasShipOnDeploy: false,
    }),
}));
