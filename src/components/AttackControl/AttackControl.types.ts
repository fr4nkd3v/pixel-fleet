import { TCoordinate } from "~/types/game";

export interface IAttackControlProps {
  targetCoordinates: TCoordinate;
  onChangeTargetCoordinates: (coordinateAxis: 'x' | 'y', value: string) => void;
  onShoot: () => void;
}