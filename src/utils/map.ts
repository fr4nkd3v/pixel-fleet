import { TCoordinate, TFleet, TMap, TMapCoordinate } from "~/types/game";
import battleMapCSS from "~/components/shared/battle-map/battle-map.module.css";

export const attackMap = (
  targetCoordinates: TCoordinate,
  map: TMap,
  fleet: TFleet
) => {
  const { x, y } = targetCoordinates;
  let newMap: TMap = [];
  let newFleet: TFleet = [...fleet];
  let foundCoordinate = false;
  let shipDestroyedId: null | string = null;

  for (const coordinate of map) {
    if (coordinate.x === x && coordinate.y === y) {
      // If is the same coordinate
      foundCoordinate = true;
      const attackedCoordinate: TMapCoordinate = {
        ...coordinate,
        attacked: true,
      };

      if (coordinate.covered) {
        // If a ship is located in the coordinate
        const { shipId } = coordinate.covered;
        newFleet = newFleet.map((ship) => {
          if (ship.id !== shipId) return ship;

          const newHealth = ship.health - 1;
          if (newHealth <= 0) shipDestroyedId = shipId;
          return { ...ship, health: newHealth };
        });
      }

      newMap.push(attackedCoordinate);
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

  if (shipDestroyedId) {
    // If a ship was destroyed
    newMap = newMap.map((coordinate) => {
      if (coordinate.covered && coordinate.covered.shipId === shipDestroyedId) {
        return {
          ...coordinate,
          covered: { ...coordinate.covered, isDefeated: true },
        };
      } else {
        return coordinate;
      }
    });
  }

  return {
    map: newMap,
    fleet: newFleet,
  };
};

export const clearTilesAvailableStyles = (
  tiles: Element[] | NodeListOf<Element>
) => {
  tiles.forEach((tile) =>
    tile.classList.remove(
      battleMapCSS["is-available"],
      battleMapCSS["is-unavailable"]
    )
  );
};

export const getTilesByCoordinates = (
  coordinates: TCoordinate[]
): HTMLElement[] => {
  const tiles = coordinates
    .map((coor) => document.getElementById(`player${coor.y}${coor.x}`))
    .filter((tile) => tile !== null);
  return tiles;
};
