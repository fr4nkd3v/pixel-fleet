export interface IGameStore {
  hasGameStarted: boolean;
  isPlayerTurn: boolean;
  isShooting: boolean;
  startGame: () => void;
  endGame: () => void;
  toggleTurn: () => void;
  startsShooting: () => void;
  finishShooting: () => void;
}
