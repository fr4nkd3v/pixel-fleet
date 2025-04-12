import { COORDINATES_LENGTH } from "~/constants/game";
import { TCoordinates, TOrientationType } from "~/types/game";

// Get integer random number including the minimum & maximum
export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomCoordinate = (): TCoordinates => {
  return {
    x: getRandomInt(1, COORDINATES_LENGTH),
    y: getRandomInt(1, COORDINATES_LENGTH),
  };
};

export const getRandomOrientation = (): TOrientationType => {
  const orientations: TOrientationType[] = ["horizontal", "vertical"];
  return orientations[getRandomInt(0, 1)] || "horizontal";
};
