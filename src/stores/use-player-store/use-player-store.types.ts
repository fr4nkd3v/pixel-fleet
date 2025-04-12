import { TFleet, TMap, TShipId, TMapCoordinate, TCoordinates, TEmptyCoordinates } from "~/types/game";

export interface IOpponentStore {
  fleet: TFleet;
  map: TMap;
  targetCoordinates: TCoordinates | TEmptyCoordinates;
  setFleet: (fleet: TFleet) => void;
  setMap: (map: TMap) => void;
  setTargetCoordinates: (targetCoordinates: TCoordinates) => void;
  restartState: () => void;
}

export interface IPlayerStore extends IOpponentStore {
  deployShip: (shipId: TShipId, coveredCoordinates: TMapCoordinate[]) => void;
  redeployShip: (redeployShipId: TShipId) => void;
  removeRedeployShipState: (redeployShipId: TShipId) => void;
  removeShip: (shipId: TShipId) => void;
  updateTargetCoordinateX: (value: number) => void;
  updateTargetCoordinateY: (value: number) => void;
}
