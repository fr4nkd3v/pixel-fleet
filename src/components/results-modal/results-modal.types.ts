export const resultsModalTypes = ["win", "fail"] as const;

type ModalType = (typeof resultsModalTypes)[number];
export interface IResultsModal {
  isVisible?: boolean;
  type: ModalType;
  onRetryClick: () => void;
  onToHomeClick: () => void;
}
