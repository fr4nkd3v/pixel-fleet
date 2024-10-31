export interface IEndGameModal {
  type: "win" | "fail";
  onRetryClick: () => void;
  onToHomeClick: () => void;
}
