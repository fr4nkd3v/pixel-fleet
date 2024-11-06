import { create } from "zustand";
import { IGameStore } from "./use-game-store.types";

export const useGameStore = create<IGameStore>((set) => ({
  hasGameStarted: false,
  gamePhase: "prestart",
  isPlayerTurn: true,
  isShooting: false,
  isPlayerWins: null,
  startGame: () => set({ gamePhase: "start" }),
  endGame: () => set({ gamePhase: "end" }),
  toggleTurn: () => set((state) => ({ isPlayerTurn: !state.isPlayerTurn })),
  startsShooting: () => set({ isShooting: true }),
  finishShooting: () => set({ isShooting: false }),
  setPlayerWins: (bool: boolean) => set({ isPlayerWins: bool }),
  restartState: () =>
    set({
      gamePhase: "prestart",
      isPlayerTurn: true,
      isShooting: false,
      isPlayerWins: null,
    }),
}));
