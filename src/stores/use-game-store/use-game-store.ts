import { create } from "zustand";
import { IGameStore } from "./use-game-store.types";

export const useGameStore = create<IGameStore>((set) => ({
  hasStarted: false,
  isPlayerTurn: true,
  isShooting: false,
  startGame: () => set({ hasStarted: true }),
  endGame: () => set({ hasStarted: false }),
  setPlayerTurn: () => set({ isPlayerTurn: true }),
  setOpponentTurn: () => set({ isPlayerTurn: false }),
  startsShooting: () => set({ isShooting: true }),
  finishShooting: () => set({ isShooting: false }),
}));
