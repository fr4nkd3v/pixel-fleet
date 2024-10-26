import { create } from "zustand";
import { IGameStore } from "./use-game-store.types";

export const useGameStore = create<IGameStore>((set) => ({
  hasGameStarted: false,
  isPlayerTurn: true,
  isShooting: false,
  startGame: () => set({ hasGameStarted: true }),
  endGame: () => set({ hasGameStarted: false }),
  toggleTurn: () => set((state) => ({ isPlayerTurn: !state.isPlayerTurn })),
  startsShooting: () => set({ isShooting: true }),
  finishShooting: () => set({ isShooting: false }),
}));
