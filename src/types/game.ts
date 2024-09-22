import { SHIP_IDS } from '~/constants/game';

export type TShipId = typeof SHIP_IDS[number];

export type TFleet = {
  id: TShipId;
  name: string;
  health: number;
  location: TCoordinate | null;
}[]

export type TCoordinate = {
  x: string;
  y: number;
}

export type TCoveredShip = {
  shipPart: TShipPart;
  orientation: TOrientationType;
}

export type TShipPart = 'start' | 'middle' | 'end';

export type TMapCoordinate = {
  x: string;
  y: number;
  covered: false | TCoveredShip;
  attacked: boolean;
}

export type TOrientationType = 'horizontal' | 'vertical';

export type TCurrentShipOnDeploy = {
  shipId: TShipId;
  orientation: TOrientationType;
};

export type TCursorLocation = {
  x: number;
  y: number;
};
