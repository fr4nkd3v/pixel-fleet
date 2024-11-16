import { TCoordinate } from "~/types/game";

export interface IAttackControlProps {
  targetCoordinates: TCoordinate | null;
  disabled: boolean;
  onChangeTargetCoordinates: (coordinateAxis: "x" | "y", value: string) => void;
  onShootButtonClick: () => void;
}
