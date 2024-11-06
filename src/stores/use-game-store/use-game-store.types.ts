export interface IGameStore {
  hasGameStarted: boolean;
  gamePhase: "prestart" | "start" | "end";
  isPlayerTurn: boolean;
  isShooting: boolean;
  isPlayerWins: boolean | null;
  startGame: () => void;
  endGame: () => void;
  toggleTurn: () => void;
  startsShooting: () => void;
  finishShooting: () => void;
  setPlayerWins: (bool: boolean) => void;
  restartState: () => void;
}
