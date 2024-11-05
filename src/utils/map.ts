import { TCoordinate, TFleet, TMap } from "~/types/game";

export const attackMap = (
  targetCoordinates: TCoordinate,
  map: TMap,
  fleet: TFleet
) => {
  const { x, y } = targetCoordinates;
  const newMap: TMap = [];
  let newFleet: TFleet = [...fleet];
  let foundCoordinateShooted = false;

  for (const coor of map) {
    if (coor.x === x && coor.y === y) {
      // If is the same coordinate
      foundCoordinateShooted = true;
      newMap.push({ ...coor, attacked: true });

      if (coor.covered !== false) {
        // If a ship is located in the coordinate
        const { shipId } = coor.covered;
        newFleet = newFleet.map((ship) => {
          if (ship.id === shipId) {
            return { ...ship, health: ship.health - 1 };
          } else {
            return ship;
          }
        });
      }
    } else {
      // If is a different coordinate
      newMap.push({ ...coor });
    }
  }

  if (!foundCoordinateShooted) {
    // If the coordinate was not found
    newMap.push({
      x,
      y,
      attacked: true,
      covered: false,
    });
  }

  return {
    map: newMap,
    fleet: newFleet,
  };
};

export const calculatePlayerIsWinner = (
  playerFleet: TFleet,
  opponentFleet: TFleet
) => {
  if (playerFleet.every((ship) => ship.health === 0)) {
    return false;
  } else if (opponentFleet.every((ship) => ship.health === 0)) {
    return true;
  } else {
    return null;
  }
};
