import { TOrientationType, TShipId } from "~/types/game";

export const MAP_SIZE = 10;

export const SHIP_IDS = [
  "missile_launcher",
  "battleship",
  "destroyer",
  "submarine",
  "speedboat",
] as const;

type TShipType = {
  [key in (typeof SHIP_IDS)[number]]: {
    name: string;
    length: number;
  };
};

export const SHIP_TYPES: TShipType = {
  missile_launcher: {
    name: "Lanzamisiles",
    length: 5,
  },
  battleship: {
    name: "Acorazado",
    length: 4,
  },
  destroyer: {
    name: "Destructor",
    length: 3,
  },
  submarine: {
    name: "Submarino",
    length: 2,
  },
  speedboat: {
    name: "Lanchero",
    length: 1,
  },
};

export const AVAILABLE_FLEET_IDS: TShipId[] = [
  // 'missile_launcher',
  // 'battleship',
  "destroyer",
  "submarine",
];

export const DEFAULT_ORIENTATION: TOrientationType = "horizontal";

export const DEFAULT_ATTACK_DELAY: number = 100; // In miliseconds
