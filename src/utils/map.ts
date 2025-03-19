import { TCoordinate, TFleet, TMap, TMapCoordinate } from "~/types/game";
import battleMapCSS from "~/components/shared/battle-map/battle-map.module.css";
import gamePageCSS from "~/components/pages/game-page/game-page.module.css";
import { parseNumberCoordinateX } from "./coordinates";
import { MAP_SIZE } from "~/constants";

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

export const getPlayerTilesByCoordinates = (
  coordinates: TCoordinate[]
): Element[] | null => {
  const playerMap = document.querySelector(
    "." + gamePageCSS["GamePage-BattleMapPlayer"]
  );
  if (!playerMap) return null;

  const tiles = coordinates
    .map((coordinate) =>
      playerMap.querySelector(
        `[data-coordinate-x="${coordinate.x}"][data-coordinate-y="${coordinate.y}"]`
      )
    )
    .filter((tile) => tile !== null);
  return tiles;
};

export const isAxisXTile = (coordinates: TCoordinate) => {
  const { x, y: coordinateY } = coordinates;
  const coordinateX = parseNumberCoordinateX(x);

  return coordinateY === 0 && coordinateX > 0 && coordinateX < MAP_SIZE + 1;
};

export const isAxisYTile = (coordinates: TCoordinate) => {
  const { x, y: coordinateY } = coordinates;
  const coordinateX = parseNumberCoordinateX(x);

  return coordinateX === 0 && coordinateY > 0 && coordinateY < MAP_SIZE + 1;
};

export const isTile = (element: Element) => {
  return element.classList.contains(battleMapCSS["BattleMap-tile"]);
};
