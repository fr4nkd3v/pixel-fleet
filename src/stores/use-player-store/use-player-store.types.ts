import {
  TCoordinate,
  TFleet,
  TMap,
  TShipId,
  TMapCoordinate,
} from "~/types/game";

export interface IOpponentStore {
  fleet: TFleet;
  map: TMap;
  targetCoordinates: TCoordinate | null;
  setFleet: (fleet: TFleet) => void;
  setMap: (map: TMap) => void;
  setTargetCoordinates: (targetCoordinates: TCoordinate) => void;
  updateTargetCoordinateX: (value: string) => void;
  updateTargetCoordinateY: (value: number) => void;
}

export interface IPlayerStore extends IOpponentStore {
  deployShipInFleet: (
    shipId: TShipId,
    coveredCoordinates: TMapCoordinate[]
  ) => void;
}
