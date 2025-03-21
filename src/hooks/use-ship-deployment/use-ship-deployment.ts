import { useRef } from "react";
import { SHIP_TYPES } from "~/constants";
import { usePlayerStore, useShipDeployStore } from "~/stores";
import { TCoordinate, TCursorLocation, TShipId } from "~/types";
import {
  clearTilesAvailableStyles,
  getCoveredCoordinates,
  getNextCoordinates,
  getPlayerTilesByCoordinates,
  hasCoordinateCovered,
  isTile,
} from "~/utils";
import battleMapCSS from "~/components/shared/battle-map/battle-map.module.css";

export const useShipDeployment = () => {
  const hoveredTile = useRef<HTMLElement | null>(null);
  const {
    orientation: shipDeployOrientation,
    shipId: shipDeployId,
    clearShipOnDeploy,
    setShipOnDeploy,
  } = useShipDeployStore();
  const { map: playerMap, deployShipInFleet, removeShipOnFeet } = usePlayerStore();

  const handleDragStart = (
    shipId: TShipId,
    locationXY: [number, number],
    setCursorLocation: (cursorLocation: TCursorLocation) => void,
  ) => {
    const [x, y] = locationXY;
    setShipOnDeploy(shipId);
    setCursorLocation({ left: x, top: y });
  };

  const handleReDragStart = (
    target: HTMLElement,
    locationXY: [number, number],
    setCursorLocation: (cursorLocation: TCursorLocation) => void,
  ) => {
    const { coordinateX, coordinateY } = target.dataset;
    if (!isTile(target) || !coordinateX || !coordinateY) return;

    const foundCoordinate = playerMap.find(({ x, y }) => x === coordinateX && y === Number(coordinateY));
    if (!foundCoordinate || !foundCoordinate.covered) return;

    const { shipId: targetShipId } = foundCoordinate.covered;
    const [x, y] = locationXY;

    setShipOnDeploy(targetShipId);
    setCursorLocation({ left: x, top: y });
  };

  const handleDragMove = (
    target: HTMLElement,
    locationXY: [number, number],
    setCursorLocation: (cursorLocation: TCursorLocation) => void,
  ) => {
    const [x, y] = locationXY;
    setCursorLocation({ left: x, top: y });

    const { coordinateX, coordinateY: strCoordinateY } = target.dataset;
    if (!isTile(target) || !coordinateX || !strCoordinateY || !shipDeployId) return;

    const coordinateY = Number(strCoordinateY);
    const shipLength = SHIP_TYPES[shipDeployId].length;

    const cleanupPreviousTiles = (previousTile: HTMLElement) => {
      const { coordinateX: prevX, coordinateY: strPrevY } = previousTile.dataset;
      const prevY = Number(strPrevY);

      if (prevX && prevY) {
        const previousCoordinates = getNextCoordinates(prevX, prevY, shipLength, shipDeployOrientation);
        const previousTiles = getPlayerTilesByCoordinates(previousCoordinates);
        if (previousTiles) clearTilesAvailableStyles(previousTiles);
      }
    };

    const highlightNextTiles = () => {
      const nextCoordinates = getNextCoordinates(coordinateX, coordinateY, shipLength, shipDeployOrientation);

      const isOutOfArea = nextCoordinates.length < shipLength;
      const isCovered = hasCoordinateCovered(nextCoordinates, playerMap);

      const nextTiles = getPlayerTilesByCoordinates(nextCoordinates);
      if (!nextTiles) return;

      nextTiles.forEach((tile) => {
        tile.classList.add(battleMapCSS[isOutOfArea || isCovered ? "is-unavailable" : "is-available"]);
      });

      hoveredTile.current = target;
    };

    const isAnotherTile = hoveredTile.current && hoveredTile.current !== target;

    if (!hoveredTile.current || isAnotherTile) {
      if (isAnotherTile && hoveredTile.current) cleanupPreviousTiles(hoveredTile.current);

      highlightNextTiles();
    }
  };

  const handleDragEnd = (target: HTMLElement, redeploy: boolean = false) => {
    const finishDeploy = () => {
      hoveredTile.current = null;
      clearShipOnDeploy();
    };

    const deployShip = (shipId: TShipId, nextCoordinates: TCoordinate[]) => {
      if (redeploy) removeShipOnFeet(shipId);
      const coveredCoordinates = getCoveredCoordinates(nextCoordinates, shipId, shipDeployOrientation);

      deployShipInFleet(shipId, coveredCoordinates);
      finishDeploy();
    };

    const { coordinateX, coordinateY: strCoordinateY } = target.dataset;

    if (!isTile(target) || !coordinateX || !strCoordinateY || !shipDeployId) {
      finishDeploy();
      return;
    }

    const coordinateY = Number(strCoordinateY);
    const shipLength = SHIP_TYPES[shipDeployId].length;

    const nextCoordinates = getNextCoordinates(coordinateX, coordinateY, shipLength, shipDeployOrientation);
    const nexTiles = getPlayerTilesByCoordinates(nextCoordinates);

    const isCovered = hasCoordinateCovered(nextCoordinates, playerMap);
    const isOutOfArea = nextCoordinates.length < shipLength;

    // ❌ Is unavailable | out-of-area location or location covered by another ship
    if (isOutOfArea || isCovered) {
      finishDeploy();
      if (nexTiles) clearTilesAvailableStyles(nexTiles);
      return;
    }

    // ✅ Is available
    deployShip(shipDeployId, nextCoordinates);
    if (nexTiles) clearTilesAvailableStyles(nexTiles);
  };

  return { handleDragStart, handleDragMove, handleDragEnd, handleReDragStart };
};
