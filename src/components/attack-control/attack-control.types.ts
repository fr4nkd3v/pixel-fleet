import { TCoordinate, TEmptyCoordinate } from "~/types/game";

export interface IAttackControlProps {
  targetCoordinates: TCoordinate | TEmptyCoordinate;
  disabled: boolean;
  onChangeTargetCoordinates: (coordinateAxis: "x" | "y", value: string) => void;
  onShootButtonClick: () => void;
}
