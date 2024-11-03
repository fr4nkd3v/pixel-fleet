export const endGameModalTypes = ["win", "fail"] as const;

type GameModalType = (typeof endGameModalTypes)[number];
export interface IEndGameModal {
  isVisible: boolean;
  type: GameModalType;
  onRetryClick: () => void;
  onToHomeClick: () => void;
}
