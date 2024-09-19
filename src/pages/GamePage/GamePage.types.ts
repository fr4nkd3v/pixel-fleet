import { TShipNameKeys } from "~/types/game";

export type TUserFleetState = {
  id: TShipNameKeys;
  name: string;
  health: number;
  location: {
      x: null | string;
      y: null | string;
  };
}[]

export type TMapCoordinates = {
  x: string;
  y: number;
  covered: boolean;
  attacked: boolean;
}[]

export type TOrientationType = 'horizontal' | 'vertical';

export type TCurrentShipDeploying = {
  shipId: TShipNameKeys;
  orientation: TOrientationType;
} | null;

export type TCursorLocation = {
  x: number;
  y: number;
};

export type TOptionalCursorLocation = TCursorLocation | null;