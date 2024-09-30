// semi-random selection algorithm

import { TCoordinate, TFleet, TMap, TShipId, TShipPart } from "~/types/game";
import { getNextCoordinates, hasCoordinateCovered, parseStringCoordinateX } from "./coordinates";
import { getRandomInt, getRandomOrientation } from "./random";

export const autoFleetDeploy = (mapSize: number, fleet: TFleet, map: TMap) => {
  // 1. Generate available coordinates array
  let availableCoordinates: TCoordinate[] = [];
  for (let h = 1; h <= mapSize; h++) {
    for (let w = 1; w <= mapSize; w++) {
      availableCoordinates.push({
        x: parseStringCoordinateX(w),
        y: h,
      })
    }
  }
  // console.log('coordenadas disponibles:', availableCoordinates.length);

  // 2. Iterate fleet
  fleet.forEach(ship => {
    const { id, health, name } = ship;
    const maximumNumberOfTries = 10;
    const nextMapCoordinates = tryRandomCoordinate(availableCoordinates, maximumNumberOfTries, id, health, map);
    if (!nextMapCoordinates) {
      console.log(`❌ No se pudieron encontrar coordenadas para el barco ${name}`);
      return;
    }

    // ✅ Deploy

    // Update available coordinates
    availableCoordinates = availableCoordinates.filter(availableCoor => {
      const isMatch = nextMapCoordinates.some(nextCoor => (
        nextCoor.x === availableCoor.x && nextCoor.y === availableCoor.y
      ))
      return !isMatch;
    })

    // Save coordinates in map array
    map.push(...nextMapCoordinates);

    // Update state of fleet
    fleet = fleet.map(ship => {
      if (ship.id === id) {
        return {
          ...ship,
          isDeployed: true,
        }
      } else {
        return ship;
      }
    })
    // console.log(`✅ Si se pudieron encontrar coordenadas para el barco ${name}`);
  })
  // console.log('Coordenadas disponibles:', availableCoordinates.length);
  // console.log('Estado de flota:', fleet);
  // console.log('Estado del mapa:', map);

  const isFleetDeployedSuccessfully = fleet.every(ship => ship.isDeployed);
  if (isFleetDeployedSuccessfully) {
    return { ok: true, fleet, map }
  } else {
    return { ok: false, fleet, map }
  }
}

function tryRandomCoordinate (
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

    const nextCoordinates = getNextCoordinates(randomCoordinate.x, randomCoordinate.y, shipLength, randomOrientation);
    isAvailable = (
      nextCoordinates.length === shipLength &&
      !hasCoordinateCovered(nextCoordinates, map)
    );

    nextMapCoordinates = nextCoordinates.map((coor, index) => {
      let shipPart: TShipPart | undefined;
      if (index === 0) shipPart = 'start'
      else if (index === nextCoordinates.length - 1) shipPart = 'end';
      else shipPart = 'middle';

      return {
        x: coor.x,
        y: coor.y,
        covered: {
          shipId,
          orientation: randomOrientation,
          shipPart,
        },
        attacked: false,
      }
    });

    counterTries++;
    // console.log(`tryRandomCoordinate - Intento ${counterTries}, Coordenadas propuestas: ${nextCoordinates.map(c => `${c.x}${c.y}`).join('|')}, Está disponible: ${isAvailable}`);
  }

  if (isAvailable) {
    return nextMapCoordinates;
  } else {
    return null;
  }
}

// TODO: make algorithm fallback for try no-ramdon search available coordinates