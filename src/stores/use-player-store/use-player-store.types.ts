import { TCoordinate, TFleet, TMap, TShipId, TMapCoordinate, TEmptyCoordinate } from "~/types/game";

export interface IOpponentStore {
  fleet: TFleet;
  map: TMap;
  targetCoordinates: TCoordinate | TEmptyCoordinate;
  setFleet: (fleet: TFleet) => void;
  setMap: (map: TMap) => void;
  setTargetCoordinates: (targetCoordinates: TCoordinate) => void;
  restartState: () => void;
}

export interface IPlayerStore extends Omit<IOpponentStore, "setTargetCoordinates"> {
  deployShipInFleet: (shipId: TShipId, coveredCoordinates: TMapCoordinate[]) => void;
  removeShipOnFeet: (shipId: TShipId) => void;
  updateTargetCoordinateX: (value: string) => void;
  updateTargetCoordinateY: (value: number) => void;
}
