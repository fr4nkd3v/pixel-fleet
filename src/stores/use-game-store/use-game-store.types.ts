export interface IGameStore {
  hasStarted: boolean;
  isPlayerTurn: boolean;
  isShooting: boolean;
  startGame: () => void;
  endGame: () => void;
  setPlayerTurn: () => void;
  setOpponentTurn: () => void;
  startsShooting: () => void;
  finishShooting: () => void;
}
