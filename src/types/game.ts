import { SHIP_IDS } from '~/constants/game';

export type TShipNameKeys = typeof SHIP_IDS[number];

export type TCoordinate = {
  x: string;
  y: number;
}