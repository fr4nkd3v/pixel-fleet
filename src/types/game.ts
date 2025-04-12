import { SHIP_IDS } from "~/constants/game";

export type TShipId = (typeof SHIP_IDS)[number];

export type TShip = {
  id: TShipId;
  name: string;
  health: number;
  isDeployed: boolean;
};

export type TFleet = TShip[];

export type TShipPart = "start" | "middle" | "end";

export type TOrientationType = "horizontal" | "vertical";

export type TCoveredShip = {
  shipId: TShipId;
  shipPart: TShipPart;
  orientation: TOrientationType;
  isDefeated: boolean;
  isRedeploy: boolean;
};

export type TCoordinates = { x: number; y: number };

export type TEmptyCoordinates = {
  x: number | null;
  y: number | null;
};

export type TEmptyCoordinate = {
  x: string | null;
  y: number | null;
};

export type TMapCoordinate = {
  x: number;
  y: number;
  covered: false | TCoveredShip;
  attacked: boolean;
};

export type TMap = TMapCoordinate[];

export type TShipOnDeploy = {
  shipId: TShipId | null;
  orientation: TOrientationType | null;
};

export type TCursorLocation = {
  left: number;
  top: number;
};

export type TPerspective = "player" | "opponent";
