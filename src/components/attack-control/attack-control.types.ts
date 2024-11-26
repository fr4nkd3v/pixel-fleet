import { MutableRefObject } from "react";
import { TCoordinate, TEmptyCoordinate } from "~/types/game";

export interface IAttackControlProps {
  targetCoordinates: TCoordinate | TEmptyCoordinate;
  disabled: boolean;
  coordinateYInputRef?: MutableRefObject<HTMLInputElement | null>;
  onChangeTargetCoordinates: (coordinateAxis: "x" | "y", value: string) => void;
  onShootButtonClick: () => void;
}
