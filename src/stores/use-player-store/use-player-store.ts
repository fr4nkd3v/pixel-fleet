import { create } from "zustand";
import { IOpponentStore, IPlayerStore } from "./use-player-store.types";
import { TMap, TFleet, TShipId, TMapCoordinate, TCoordinate } from "~/types/game";

export const useOpponentStore = create<IOpponentStore>((set) => ({
  fleet: [],
  map: [],
  targetCoordinates: { x: null, y: null },
  setFleet: (fleet: TFleet) => set({ fleet }),
  setMap: (map: TMap) => set({ map }),
  setTargetCoordinates: (targetCoordinates: TCoordinate) => set({ targetCoordinates }),
  restartState: () =>
    set({
      fleet: [],
      map: [],
      targetCoordinates: { x: null, y: null },
    }),
}));

export const usePlayerStore = create<IPlayerStore>((set) => ({
  fleet: [],
  map: [],
  targetCoordinates: { x: null, y: null },
  setFleet: (fleet: TFleet) => set({ fleet }),
  setMap: (map: TMap) => set({ map }),
  deployShipInFleet: (shipId: TShipId, coveredCoordinates: TMapCoordinate[]) =>
    set((state) => ({
      fleet: state.fleet.map((ship) =>
        ship.id === shipId && !ship.isDeployed ? { ...ship, isDeployed: true } : ship,
      ),
      map: [...state.map, ...coveredCoordinates],
    })),
  removeShipOnFeet: (shipId: TShipId) =>
    set((state) => ({
      fleet: state.fleet.map((ship) => {
        if (ship.id === shipId) {
          return { ...ship, isDeployed: false };
        } else return ship;
      }),
      map: state.map.filter((coordinate) => coordinate.covered && coordinate.covered.shipId !== shipId),
    })),
  setTargetCoordinates: (targetCoordinates: TCoordinate) => set({ targetCoordinates }),
  updateTargetCoordinateX: (value: string) =>
    set((state) => ({
      targetCoordinates: { y: state.targetCoordinates?.y || 1, x: value },
    })),
  updateTargetCoordinateY: (value: number) =>
    set((state) => ({
      targetCoordinates: { y: value, x: state.targetCoordinates?.x || "a" },
    })),
  restartState: () =>
    set({
      fleet: [],
      map: [],
      targetCoordinates: { x: null, y: null },
    }),
}));
