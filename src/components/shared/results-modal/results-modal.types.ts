export const resultsModalTypes = ["win", "fail"] as const;

export interface IResultsModal {
  onRetryClick: () => void;
  onToHomeClick: () => void;
}
