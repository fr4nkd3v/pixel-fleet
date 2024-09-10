export const SHIP_NAMES = [
  'missile_launcher',
  'battleship',
  'destroyer',
  'submarine',
  'speedboat',
] as const;

// type TShipNameKeys = ;

type TShipType = {
  [key in (
    typeof SHIP_NAMES[number]
  )]: {
    name: string,
    length: number
  }
};

export const SHIP_TYPES: TShipType = {
  'missile_launcher': {
    name: 'Lanzamisiles',
    length: 5,
  },
  'battleship': {
    name: 'Acorazado',
    length: 4,
  },
  'destroyer': {
    name: 'Destructor',
    length: 3,
  },
  'submarine': {
    name: 'Submarino',
    length: 2,
  },
  'speedboat': {
    name: 'Lanchero',
    length: 1,
  }
};