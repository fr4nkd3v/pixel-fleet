import { MAXIMUM_MAP_SIZE } from "~/constants/game";
import { TCoordinate, TMapCoordinate, TOrientationType } from "~/types/game";

export const parseCoordinateX = (coor: number): string => {
  return String.fromCharCode(coor + 96);
}

export const isValidCoordinate = (x: string, y: number) => {
  return ('abcdefghij'.includes(x) && y > 0 && y < 11);
}

export const getTilesByCoordinates = (
  coordinates: TCoordinate[]
): HTMLElement[] => {
  const tiles = coordinates
    .map(coor => document.getElementById(`${coor.y}${coor.x}`))
    .filter(tile => tile !== null)
  return tiles;
}

export const getNextCoordinates = (
  x: string, y: number, length: number, orientation: TOrientationType
): TCoordinate[] => {
  const coordinates = [];
  const maxPointX = MAXIMUM_MAP_SIZE + 'a'.charCodeAt(0) - 1;
  const maxPointY = MAXIMUM_MAP_SIZE;

  for (let index = 0; index < length; index++) {
    let coordinate;
    if (orientation === 'horizontal' && (x.charCodeAt(0) + index) <= maxPointX) {
      const newCoordinateX = String.fromCharCode(x.charCodeAt(0) + index)
      coordinate = {x: newCoordinateX, y};
    } else
    if (orientation === 'vertical' && (y + index) <= maxPointY) {
      const newCoordinateY = y + index;
      coordinate = {x, y: newCoordinateY};
    }
    if (coordinate) coordinates.push(coordinate);
  }
  return coordinates;
}

export const hasCoordinateCovered = (
  coordinates: TCoordinate[], mapCoordinates: TMapCoordinate[]
): boolean => {
  return coordinates.some(coor => {
    const coordinateCovered = mapCoordinates.find(mapCoor => (
      mapCoor.x === coor.x && mapCoor.y === coor.y && mapCoor.covered
    ))
    return Boolean(coordinateCovered);
  });
}