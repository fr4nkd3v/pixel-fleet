import { TCoordinate, TFleet, TMap } from "~/types/game";

export const attackMap = (
  targetCoordinates: TCoordinate,
  map: TMap,
  fleet: TFleet
) => {
  const { x, y } = targetCoordinates;
  const newMap: TMap = [];
  let newFleet: TFleet = [...fleet];
  let foundCoordinate = false;

  for (const coordinate of map) {
    if (coordinate.x === x && coordinate.y === y) {
      // If is the same coordinate
      foundCoordinate = true;
      newMap.push({ ...coordinate, attacked: true });

      if (coordinate.covered) {
        // If a ship is located in the coordinate
        const { shipId } = coordinate.covered;
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
      newMap.push({ ...coordinate });
    }
  }

  if (!foundCoordinate) {
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
