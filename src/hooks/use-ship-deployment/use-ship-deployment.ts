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
  const { map: playerMap, deployShip, redeployShip, removeShip, removeRedeployShipState } = usePlayerStore();

  const cleanupPreviousTiles = (previousTile: HTMLElement) => {
    const { coordinateX: prevX, coordinateY: strPrevY } = previousTile.dataset;
    const prevY = Number(strPrevY);

    if (prevX && prevY && shipDeployId) {
      const shipLength = SHIP_TYPES[shipDeployId].length;
      const previousCoordinates = getNextCoordinates(prevX, prevY, shipLength, shipDeployOrientation);
      const previousTiles = getPlayerTilesByCoordinates(previousCoordinates);
      if (previousTiles) clearTilesAvailableStyles(previousTiles);
    }
  };

  const highlightNextTiles = (coordinateX: string, coordinateY: number, target: HTMLElement) => {
    if (!shipDeployId) return;

    const shipLength = SHIP_TYPES[shipDeployId].length;
    const nextCoordinates = getNextCoordinates(coordinateX, coordinateY, shipLength, shipDeployOrientation);

    const isOutOfArea = nextCoordinates.length < shipLength;
    const isCoveredForAnotherShip = hasCoordinateCovered(nextCoordinates, playerMap, shipDeployId);

    const nextTiles = getPlayerTilesByCoordinates(nextCoordinates);
    if (!nextTiles) return;

    nextTiles.forEach((tile) => {
      tile.classList.add(
        battleMapCSS[isOutOfArea || isCoveredForAnotherShip ? "is-unavailable" : "is-available"],
      );
    });

    hoveredTile.current = target;
  };

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

    redeployShip(targetShipId);
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
    if (!isTile(target) || !coordinateX || !strCoordinateY || !shipDeployId) {
      if (hoveredTile.current) {
        cleanupPreviousTiles(hoveredTile.current);
        hoveredTile.current = null;
      }
      return;
    }

    const coordinateY = Number(strCoordinateY);
    const isAnotherTile = hoveredTile.current && hoveredTile.current !== target;

    if (!hoveredTile.current || isAnotherTile) {
      if (isAnotherTile && hoveredTile.current) cleanupPreviousTiles(hoveredTile.current);

      highlightNextTiles(coordinateX, coordinateY, target);
    }
  };

  const handleDragEnd = (target: HTMLElement, redeploy: boolean = false) => {
    const clearDeployAndState = () => {
      hoveredTile.current = null;
      clearShipOnDeploy();
    };

    const handleDeployShip = (shipId: TShipId, nextCoordinates: TCoordinate[]) => {
      if (redeploy) removeShip(shipId);
      const coveredCoordinates = getCoveredCoordinates(nextCoordinates, shipId, shipDeployOrientation);

      deployShip(shipId, coveredCoordinates);
      clearDeployAndState();
    };

    const { coordinateX, coordinateY: strCoordinateY } = target.dataset;

    if (!isTile(target) || !coordinateX || !strCoordinateY || !shipDeployId) {
      if (shipDeployId) removeRedeployShipState(shipDeployId);

      clearDeployAndState();
      return;
    }

    const coordinateY = Number(strCoordinateY);
    const shipLength = SHIP_TYPES[shipDeployId].length;

    const nextCoordinates = getNextCoordinates(coordinateX, coordinateY, shipLength, shipDeployOrientation);
    const nexTiles = getPlayerTilesByCoordinates(nextCoordinates);

    const isCoveredForAnotherShip = hasCoordinateCovered(nextCoordinates, playerMap, shipDeployId);
    const isOutOfArea = nextCoordinates.length < shipLength;

    // ❌ Is unavailable | out-of-area location or location covered by another ship
    if (isOutOfArea || isCoveredForAnotherShip) {
      if (nexTiles) clearTilesAvailableStyles(nexTiles);
      if (shipDeployId) removeRedeployShipState(shipDeployId);
      clearDeployAndState();
      return;
    }

    // ✅ Is available
    handleDeployShip(shipDeployId, nextCoordinates);
    if (nexTiles) clearTilesAvailableStyles(nexTiles);
  };

  const handleDragCancel = () => {
    if (shipDeployId) removeRedeployShipState(shipDeployId);
    if (hoveredTile.current) cleanupPreviousTiles(hoveredTile.current);
    clearShipOnDeploy();
    hoveredTile.current = null;
  };

  return { handleDragStart, handleDragMove, handleDragEnd, handleReDragStart, handleDragCancel };
};
