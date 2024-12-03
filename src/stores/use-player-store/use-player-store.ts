import { create } from "zustand";
import { IOpponentStore, IPlayerStore } from "./use-player-store.types";
import {
  TMap,
  TFleet,
  TShipId,
  TMapCoordinate,
  TCoordinate,
} from "~/types/game";

export const useOpponentStore = create<IOpponentStore>((set) => ({
  fleet: [],
  map: [],
  targetCoordinates: { x: null, y: null },
  message: "",
  setFleet: (fleet: TFleet) => set({ fleet }),
  setMap: (map: TMap) => set({ map }),
  setTargetCoordinates: (targetCoordinates: TCoordinate) =>
    set({ targetCoordinates }),
  setMessage: (message: string) => set({ message }),
  restartState: () =>
    set({
      fleet: [],
      map: [],
      targetCoordinates: { x: null, y: null },
      message: "",
    }),
}));

export const usePlayerStore = create<IPlayerStore>((set) => ({
  fleet: [],
  map: [],
  targetCoordinates: { x: null, y: null },
  message: "",
  setFleet: (fleet: TFleet) => set({ fleet }),
  setMap: (map: TMap) => set({ map }),
  deployShipInFleet: (shipId: TShipId, coveredCoordinates: TMapCoordinate[]) =>
    set((state) => ({
      fleet: state.fleet.map((ship) =>
        ship.id === shipId && !ship.isDeployed
          ? { ...ship, isDeployed: true }
          : ship
      ),
      map: [...state.map, ...coveredCoordinates],
    })),
  setTargetCoordinates: (targetCoordinates: TCoordinate) =>
    set({ targetCoordinates }),
  updateTargetCoordinateX: (value: string) =>
    set((state) => ({
      targetCoordinates: { y: state.targetCoordinates?.y || 1, x: value },
    })),
  updateTargetCoordinateY: (value: number) =>
    set((state) => ({
      targetCoordinates: { y: value, x: state.targetCoordinates?.x || "a" },
    })),
  setMessage: (message: string) => set({ message }),
  restartState: () =>
    set({
      fleet: [],
      map: [],
      targetCoordinates: { x: null, y: null },
      message: "",
    }),
}));
