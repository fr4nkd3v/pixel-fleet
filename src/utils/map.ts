import { TCoordinate, TFleet, TMap, TShipId } from "~/types/game";
import tileCSS from "~/components/shared/battle-map/tile/tile.module.css";
import gamePageCSS from "~/components/pages/game-page/game-page.module.css";
import { parseNumberCoordinateX } from "./coordinates";
import { COORDINATES_LENGTH } from "~/constants";

export const attackMap = (targetCoordinates: TCoordinate, map: TMap, fleet: TFleet) => {
  const { x, y } = targetCoordinates;
  let foundTargetCoordinate = false;
  let attackedShipId: null | string = null;
  let destroyedShipId: null | string = null;

  // Update the map and mark the coordinate as attacked.
  const mapAttacked = map.map((coordinate) => {
    if (coordinate.x === x && coordinate.y === y) {
      foundTargetCoordinate = true;
      if (coordinate.covered) attackedShipId = coordinate.covered.shipId;
      return { ...coordinate, attacked: true };
    } else {
      return { ...coordinate };
    }
  });

  // Adds the attacked coordinate if it is not on the map
  if (!foundTargetCoordinate) {
    mapAttacked.push({ x, y, attacked: true, covered: false });
  }

  if (!attackedShipId) return { map: mapAttacked, fleet };

  // Upgrade the fleet with the health of the attacked ship.
  const updatedFleet = fleet.map((ship) => {
    if (ship.id !== attackedShipId) return ship;

    const currentHealth = getShipCurrentHealth(attackedShipId, mapAttacked);
    if (currentHealth <= 0) destroyedShipId = ship.id;
    return { ...ship, health: currentHealth };
  });

  if (!destroyedShipId) return { map: mapAttacked, fleet: updatedFleet };

  // Mark the coordinates of the destroyed ship as defeated.
  const updatedMap = mapAttacked.map((coordinate) => {
    if (coordinate.covered && coordinate.covered.shipId === destroyedShipId) {
      return {
        ...coordinate,
        covered: { ...coordinate.covered, isDefeated: true },
      };
    } else {
      return { ...coordinate };
    }
  });

  return { map: updatedMap, fleet: updatedFleet };
};

export const clearTilesAvailableStyles = (tiles: Element[] | NodeListOf<Element>) => {
  tiles.forEach((tile) => tile.classList.remove(tileCSS["is-available"], tileCSS["is-unavailable"]));
};

export const getPlayerTilesByCoordinates = (coordinates: TCoordinate[]): Element[] | null => {
  const playerMap = document.querySelector("." + gamePageCSS["GamePage-BattleMapPlayer"]);
  if (!playerMap) return null;

  const tiles = coordinates
    .map((coordinate) =>
      playerMap.querySelector(`[data-coordinate-x="${coordinate.x}"][data-coordinate-y="${coordinate.y}"]`),
    )
    .filter((tile) => tile !== null);
  return tiles;
};

export const isAxisXTile = (coordinates: TCoordinate) => {
  const { x, y: coordinateY } = coordinates;
  const coordinateX = parseNumberCoordinateX(x);

  return coordinateY === 0 && coordinateX > 0 && coordinateX < COORDINATES_LENGTH + 1;
};

export const isAxisYTile = (coordinates: TCoordinate) => {
  const { x, y: coordinateY } = coordinates;
  const coordinateX = parseNumberCoordinateX(x);

  return coordinateX === 0 && coordinateY > 0 && coordinateY < COORDINATES_LENGTH + 1;
};

export const isTile = (element: Element) => {
  return element.classList.contains(tileCSS["BattleMap-tile"]);
};

export const getShipCurrentHealth = (shipId: TShipId, map: TMap) => {
  const coveredCoordinates = map.filter(
    (coordinate) => coordinate.covered && coordinate.covered.shipId === shipId,
  );
  const attackedCoordinates = coveredCoordinates.filter((coordinate) => coordinate.attacked);

  return coveredCoordinates.length - attackedCoordinates.length;
};
