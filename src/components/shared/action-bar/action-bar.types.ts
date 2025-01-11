import { MutableRefObject } from "react";

export interface IActionBarProps {
  coordinateYInputRef?: MutableRefObject<HTMLInputElement | null>;
  onStart: () => void;
}
