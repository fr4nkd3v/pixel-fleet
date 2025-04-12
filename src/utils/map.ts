import { TFleet, TMap, TCoordinates, TShipId, TEmptyCoordinates } from "~/types/game";
import tileCSS from "~/components/shared/battle-map/tile/tile.module.css";
import gamePageCSS from "~/components/pages/game-page/game-page.module.css";
import { COORDINATES_LENGTH } from "~/constants";
import { coordinateYToLabel } from "./coordinates";

export const attackMap = (targetCoordinates: TCoordinates, map: TMap, fleet: TFleet) => {
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

export const getPlayerTilesByCoordinates = (coordinates: TCoordinates[]): Element[] | null => {
  const playerMap = document.querySelector("." + gamePageCSS["GamePage-BattleMapPlayer"]);
  if (!playerMap) return null;

  const tiles = coordinates
    .map((coordinate) =>
      playerMap.querySelector(`[data-coordinate-x="${coordinate.x}"][data-coordinate-y="${coordinate.y}"]`),
    )
    .filter((tile) => tile !== null);
  return tiles;
};

const isAxisXTile = (indexes: TCoordinates) => {
  const { x, y } = indexes;
  return y === COORDINATES_LENGTH && x > 0 && x < COORDINATES_LENGTH + 1;
};

const isAxisYTile = (indexes: TCoordinates) => {
  const { x, y } = indexes;
  return x === 0 && y >= 0 && y < COORDINATES_LENGTH;
};

export const getTileLabelByIndexes = (indexes: TCoordinates) => {
  const { x, y } = indexes;
  return isAxisYTile(indexes) ? coordinateYToLabel(y + 1) : isAxisXTile(indexes) ? x : null;
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

export const getSightLocationByCoordinates = (coordinates: TCoordinates | TEmptyCoordinates) => {
  // By default the sight starts in the bottom-left corner of the map
  const defaultLocationX = 0;
  const defaultLocationY = 11;

  return {
    x: coordinates.x ?? defaultLocationX,
    y: (coordinates.y ?? defaultLocationY) - 1,
  };
};
