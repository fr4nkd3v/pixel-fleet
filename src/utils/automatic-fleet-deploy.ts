// semi-random selection algorithm

import { TCoordinate, TFleet, TMap, TShipId } from "~/types/game";
import { getNextCoordinates, hasCoordinateCovered, parseStringCoordinateX } from "./coordinates";
import { getRandomInt, getRandomOrientation } from "./random";
import { getShipPartByIndex } from "./fleet";

export const autoFleetDeploy = (mapSize: number, fleet: TFleet, map: TMap) => {
  // 1. Generate available coordinates array
  let availableCoordinates: TCoordinate[] = [];
  for (let h = 1; h <= mapSize; h++) {
    for (let w = 1; w <= mapSize; w++) {
      availableCoordinates.push({
        x: parseStringCoordinateX(w),
        y: h,
      });
    }
  }

  // 2. Iterate fleet
  fleet.forEach((ship) => {
    const { id, health, name } = ship;
    const maximumNumberOfTries = 10;
    const nextMapCoordinates = tryRandomCoordinate(
      availableCoordinates,
      maximumNumberOfTries,
      id,
      health,
      map,
    );
    if (!nextMapCoordinates) {
      console.error(`❌ No coordinates could be found for the ${name} ship.`);
      return;
    }

    // ✅ Deploy

    // Update available coordinates
    availableCoordinates = availableCoordinates.filter((availableCoordinate) => {
      const isMatch = nextMapCoordinates.some(
        (nextCoordinate) =>
          nextCoordinate.x === availableCoordinate.x && nextCoordinate.y === availableCoordinate.y,
      );
      return !isMatch;
    });

    // Save coordinates in map array
    map.push(...nextMapCoordinates);

    // Update state of fleet
    fleet = fleet.map((ship) => {
      if (ship.id === id) {
        return {
          ...ship,
          isDeployed: true,
        };
      } else {
        return ship;
      }
    });
  });

  const isFleetDeployedSuccessfully = fleet.every((ship) => ship.isDeployed);
  if (isFleetDeployedSuccessfully) {
    return { ok: true, fleet, map };
  } else {
    return { ok: false, fleet, map };
  }
};

function tryRandomCoordinate(
  availableCoordinates: TCoordinate[],
  triesMax: number,
  shipId: TShipId,
  shipLength: number,
  map: TMap,
): TMap | null {
  let counterTries = 0;
  let isAvailable = false;
  let nextMapCoordinates: TMap = [];

  while (!isAvailable && counterTries < triesMax) {
    const randomCoordinate = availableCoordinates[getRandomInt(0, availableCoordinates.length - 1)];
    const randomOrientation = getRandomOrientation();

    const nextCoordinates = getNextCoordinates(
      randomCoordinate.x,
      randomCoordinate.y,
      shipLength,
      randomOrientation,
    );
    isAvailable = nextCoordinates.length === shipLength && !hasCoordinateCovered(nextCoordinates, map);

    nextMapCoordinates = nextCoordinates.map((coordinate, index) => ({
      x: coordinate.x,
      y: coordinate.y,
      covered: {
        shipId,
        orientation: randomOrientation,
        shipPart: getShipPartByIndex(index, nextCoordinates.length),
        isDefeated: false,
        isRedeploy: false,
      },
      attacked: false,
    }));

    counterTries++;
  }

  if (isAvailable) {
    return nextMapCoordinates;
  } else {
    return null;
  }
}

// TODO: make algorithm fallback for try no-random search available coordinates
