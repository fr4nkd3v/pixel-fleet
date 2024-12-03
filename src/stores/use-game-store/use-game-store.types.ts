export interface IGameStore {
  gamePhase: "prestart" | "start" | "end";
  isPlayerTurn: boolean;
  isShooting: boolean;
  isPlayerWins: boolean | null;
  startGame: () => void;
  endGame: () => void;
  startsShooting: () => void;
  endShooting: () => void;
  setPlayerWins: (bool: boolean) => void;
  restartState: () => void;
  endShootingAndToggleTurn: () => void;
}
