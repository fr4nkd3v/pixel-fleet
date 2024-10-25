import { create } from "zustand";
import { TShipId, TOrientationType, TCursorLocation } from "~/types/game";
import { IShipDeployStore } from "./use-ship-deploy-store.types";

export const useShipDeployStore = create<IShipDeployStore>((set) => ({
  shipId: null,
  orientation: null,
  cursorLocation: null,
  setShipOnDeploy: (
    shipId: TShipId,
    orientation: TOrientationType,
    cursorLocation: TCursorLocation
  ) =>
    set({
      shipId,
      orientation,
      cursorLocation,
    }),
  setOrientation: (orientation: TOrientationType) => set({ orientation }),
  setCursorLocation: (cursorLocation: TCursorLocation) =>
    set({ cursorLocation }),
  clearShipOnDeploy: () => set({ shipId: null, orientation: null }),
}));
