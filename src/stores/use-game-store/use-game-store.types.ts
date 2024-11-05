export interface IGameStore {
  hasGameStarted: boolean;
  isPlayerTurn: boolean;
  isShooting: boolean;
  isPlayerWins: boolean | null;
  startGame: () => void;
  endGame: () => void;
  toggleTurn: () => void;
  startsShooting: () => void;
  finishShooting: () => void;
  setPlayerWins: (bool: boolean) => void;
}
