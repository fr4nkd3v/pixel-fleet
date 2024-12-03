import { create } from "zustand";
import { IGameStore } from "./use-game-store.types";

export const useGameStore = create<IGameStore>((set) => ({
  gamePhase: "prestart",
  isPlayerTurn: true,
  isShooting: false,
  isPlayerWins: null,
  startGame: () => set({ gamePhase: "start" }),
  endGame: () => set({ gamePhase: "end" }),
  startsShooting: () => set({ isShooting: true }),
  endShooting: () => set({ isShooting: false }),
  setPlayerWins: (bool: boolean) => set({ isPlayerWins: bool }),
  restartState: () =>
    set({
      gamePhase: "prestart",
      isPlayerTurn: true,
      isShooting: false,
      isPlayerWins: null,
    }),
  endShootingAndToggleTurn: () =>
    set((state) => ({
      isShooting: false,
      isPlayerTurn: !state.isPlayerTurn,
    })),
}));
