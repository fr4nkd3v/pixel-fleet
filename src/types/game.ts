import { SHIP_IDS } from '~/constants/game';

export type TShipId = typeof SHIP_IDS[number];

export type TShip = {
  id: TShipId;
  name: string;
  health: number;
  isDeployed: boolean;
}

export type TFleet = TShip[]

export type TShipPart = 'start' | 'middle' | 'end';

export type TOrientationType = 'horizontal' | 'vertical';

export type TCoveredShip = {
  shipId: TShipId;
  shipPart: TShipPart;
  orientation: TOrientationType;
}

export type TCoordinate = {
  x: string;
  y: number;
}

export type TMapCoordinate = {
  x: string;
  y: number;
  covered: false | TCoveredShip;
  attacked: boolean;
}

export type TMap = TMapCoordinate[];

export type TCurrentShipOnDeploy = {
  shipId: TShipId;
  orientation: TOrientationType;
};

export type TCursorLocation = {
  x: number;
  y: number;
};
