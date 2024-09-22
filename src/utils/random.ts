import { MAXIMUM_MAP_SIZE } from "~/constants/game";
import { parseStringCoordinateX } from "./coordinates";
import { TCoordinate, TOrientationType } from "~/types/game";

// Get integer random number including the minimum & maximum
export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getRandomCoordinate = (): TCoordinate => {
  return {
    x: parseStringCoordinateX(getRandomInt(1, MAXIMUM_MAP_SIZE)),
    y: getRandomInt(1, MAXIMUM_MAP_SIZE),
  }
}

export const getRandomOrientation = (): TOrientationType => {
  const orientations: TOrientationType[] = ['horizontal', 'vertical'];
  return orientations[getRandomInt(0, 1)] || 'horizontal';
}