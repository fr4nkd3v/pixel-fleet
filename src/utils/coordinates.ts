import { MAP_SIZE } from "~/constants/game";
import { TCoordinate, TMap, TOrientationType, TShipId } from "~/types/game";
import { getShipPartByIndex } from "./fleet";

export const parseStringCoordinateX = (coor: number): string => {
  return String.fromCharCode(coor + 96);
};

export const parseNumberCoordinateX = (coor: string | null): number => {
  return coor ? coor.toLowerCase().charCodeAt(0) - 96 : 0;
};

export const isValidCoordinate = (x: string, y: number) => {
  return "abcdefghij".includes(x) && y > 0 && y < 11;
};

export const getNextCoordinates = (
  x: string,
  y: number,
  length: number,
  orientation: TOrientationType,
): TCoordinate[] => {
  const coordinates = [];
  const maxPointX = MAP_SIZE + "a".charCodeAt(0) - 1;
  const maxPointY = MAP_SIZE;

  for (let index = 0; index < length; index++) {
    let coordinate;
    if (orientation === "horizontal" && x.charCodeAt(0) + index <= maxPointX) {
      const newCoordinateX = String.fromCharCode(x.charCodeAt(0) + index);
      coordinate = { x: newCoordinateX, y };
    } else if (orientation === "vertical" && y + index <= maxPointY) {
      const newCoordinateY = y + index;
      coordinate = { x, y: newCoordinateY };
    }
    if (coordinate) coordinates.push(coordinate);
  }
  return coordinates;
};

export const getCoveredCoordinates = (
  coordinatesToCover: TCoordinate[],
  coveredShipId: TShipId,
  shipOrientation: TOrientationType,
): TMap => {
  const coveredCoordinates = coordinatesToCover.map((coordinate, index) => {
    const shipPart = getShipPartByIndex(index, coordinatesToCover.length);

    return {
      x: coordinate.x,
      y: Number(coordinate.y),
      covered: {
        shipId: coveredShipId,
        orientation: shipOrientation,
        shipPart,
        isDefeated: false,
        isRedeploy: false,
      },
      attacked: false,
    };
  });

  return coveredCoordinates;
};

export const hasCoordinateCovered = (coordinates: TCoordinate[], mapCoordinates: TMap): boolean => {
  return coordinates.some((coor) => {
    const coordinateCovered = mapCoordinates.find(
      (mapCoor) => mapCoor.x === coor.x && mapCoor.y === coor.y && mapCoor.covered,
    );
    return Boolean(coordinateCovered);
  });
};

export const checkCoordinateValue = (coordinate: "x" | "y", value: string): boolean => {
  if (coordinate === "y") {
    const regexCoorY = /^(10|[1-9])$/;
    return regexCoorY.test(value);
  } else {
    const regexCoorX = /^[a-j]$/i;
    return regexCoorX.test(value);
  }
};
