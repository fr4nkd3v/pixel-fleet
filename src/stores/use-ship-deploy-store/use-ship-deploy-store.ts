import { create } from "zustand";
import { TShipId, TOrientationType } from "~/types/game";
import { IShipDeployStore } from "./use-ship-deploy-store.types";
import { DEFAULT_ORIENTATION } from "~/constants/game";

export const useShipDeployStore = create<IShipDeployStore>((set) => ({
  shipId: null,
  orientation: DEFAULT_ORIENTATION,
  hasShipOnDeploy: false,
  setShipOnDeploy: (shipId: TShipId) =>
    set({
      shipId,
      orientation: DEFAULT_ORIENTATION,
      hasShipOnDeploy: true,
    }),
  setOrientation: (orientation: TOrientationType) => set({ orientation }),
  clearShipOnDeploy: () => set({ shipId: null, hasShipOnDeploy: false }),
}));
