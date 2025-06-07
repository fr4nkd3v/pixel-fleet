import { COORDINATES_LENGTH } from "~/constants/game";
import { TMap, TCoordinates, TOrientationType, TShipId, TAxis } from "~/types/game";
import { getShipPartByIndex } from "./fleet";

export const coordinateYToLabel = (coordinateX: number): string => {
  return String.fromCharCode(coordinateX + 96);
};

export const coordinateYToNumber = (coordinateX: string): number => {
  return coordinateX.toLowerCase().charCodeAt(0) - 96;
};

export const getCoordinatesByIndexes = (indexes: TCoordinates) => {
  const { x, y } = indexes;
  const strX = coordinateYToLabel(x);

  const isValidCoordinate = "abcdefghij".includes(strX) && y >= 0 && y < 10;

  return isValidCoordinate ? { x, y: y + 1 } : { x: undefined, y: undefined };
};

export const getNextCoordinates = (
  startCoordinates: TCoordinates,
  length: number,
  orientation: TOrientationType,
): TCoordinates[] => {
  const { x, y } = startCoordinates;
  const nextCoordinates = [];
  const maxPointY = COORDINATES_LENGTH;
  const maxPointX = COORDINATES_LENGTH;

  for (let index = 0; index < length; index++) {
    let coordinate;
    if (orientation === "horizontal" && x + index <= maxPointX) {
      const newCoordinateX = x + index;
      coordinate = { x: newCoordinateX, y };
    } else if (orientation === "vertical" && y + index <= maxPointY) {
      const newCoordinateY = y + index;
      coordinate = { x, y: newCoordinateY };
    }
    if (coordinate) nextCoordinates.push(coordinate);
  }
  return nextCoordinates;
};

export const getCoveredCoordinates = (
  coordinatesToCover: TCoordinates[],
  coveredShipId: TShipId,
  shipOrientation: TOrientationType,
): TMap => {
  const coveredCoordinates = coordinatesToCover.map((coordinate, index) => {
    const shipPart = getShipPartByIndex(index, coordinatesToCover.length);

    return {
      x: coordinate.x,
      y: coordinate.y,
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

export const hasCoordinateCovered = (
  listCoordinates: TCoordinates[],
  mapCoordinates: TMap,
  shipId?: TShipId,
): boolean => {
  return listCoordinates.some((coordinates) => {
    const coordinateCovered = mapCoordinates.find((mapCoordinates) => {
      const isCovered = Boolean(
        mapCoordinates.x === coordinates.x && mapCoordinates.y === coordinates.y && mapCoordinates.covered,
      );
      const isCoveredForAnotherShip = shipId
        ? mapCoordinates.covered && mapCoordinates.covered.shipId !== shipId
        : false;

      return shipId ? isCovered && isCoveredForAnotherShip : isCovered;
    });
    return Boolean(coordinateCovered);
  });
};

export const checkCoordinateValue = (coordinate: TAxis, value: string): boolean => {
  const regexCoordinates = { x: /^(10|[1-9])$/, y: /^[a-j]$/i };
  return regexCoordinates[coordinate].test(value);
};

export const getMapCoordinateByIndexes = (indexes: TCoordinates, map: TMap) => {
  const { x, y } = indexes;
  return map.find((mapCoordinate) => mapCoordinate.x === x && mapCoordinate.y === y + 1);
};
