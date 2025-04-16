import { create } from "zustand";
import { IOpponentStore, IPlayerStore } from "./use-player-store.types";

export const useOpponentStore = create<IOpponentStore>((set) => ({
  fleet: [],
  map: [],
  targetCoordinates: { x: null, y: null },
  setFleet: (fleet) => set({ fleet }),
  setMap: (map) => set({ map }),
  setTargetCoordinates: (targetCoordinates) => set({ targetCoordinates }),
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
  setFleet: (fleet) => set({ fleet }),
  setMap: (map) => set({ map }),
  deployShip: (shipId, coveredCoordinates) =>
    set((state) => ({
      fleet: state.fleet.map((ship) =>
        ship.id === shipId && !ship.isDeployed ? { ...ship, isDeployed: true } : ship,
      ),
      map: [...state.map, ...coveredCoordinates],
    })),
  redeployShip: (redeployShipId) =>
    set((state) => ({
      map: state.map.map((coordinate) => {
        if (coordinate.covered && coordinate.covered.shipId === redeployShipId) {
          return {
            ...coordinate,
            covered: coordinate.covered ? { ...coordinate.covered, isRedeploy: true } : false,
          };
        } else {
          return coordinate;
        }
      }),
    })),
  removeRedeployShipState: (redeployShipId) =>
    set((state) => ({
      map: state.map.map((coordinate) => {
        if (coordinate.covered && coordinate.covered.shipId === redeployShipId) {
          return {
            ...coordinate,
            covered: coordinate.covered ? { ...coordinate.covered, isRedeploy: false } : false,
          };
        } else {
          return coordinate;
        }
      }),
    })),
  removeShip: (shipId) =>
    set((state) => ({
      fleet: state.fleet.map((ship) => {
        if (ship.id === shipId) {
          return { ...ship, isDeployed: false };
        } else return ship;
      }),
      map: state.map.filter((coordinate) => coordinate.covered && coordinate.covered.shipId !== shipId),
    })),
  setTargetCoordinates: (targetCoordinates) => set({ targetCoordinates }),
  updateTargetCoordinateX: (value) =>
    set((state) => ({
      targetCoordinates: { y: state.targetCoordinates?.y || 1, x: value },
    })),
  updateTargetCoordinateY: (value) =>
    set((state) => ({
      targetCoordinates: { y: value, x: state.targetCoordinates?.x || 1 },
    })),
  restartState: () =>
    set({
      fleet: [],
      map: [],
      targetCoordinates: { x: null, y: null },
    }),
}));
