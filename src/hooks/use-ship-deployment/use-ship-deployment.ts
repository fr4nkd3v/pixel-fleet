import { useRef } from "react";
import { SHIP_TYPES } from "~/constants";
import { usePlayerStore, useShipDeployStore } from "~/stores";
import { TCursorLocation, TCoordinates, TShipId } from "~/types";
import {
  clearTilesAvailableStyles,
  getCoveredCoordinates,
  getNextCoordinates,
  getPlayerTilesByCoordinates,
  hasCoordinateCovered,
  isTile,
} from "~/utils";
import tileCSS from "~/components/shared/battle-map/tile/tile.module.css";

export const useShipDeployment = () => {
  const hoveredTile = useRef<HTMLElement | null>(null);

  const {
    orientation: shipDeployOrientation,
    shipId: shipDeployId,
    clearShipOnDeploy,
    setShipOnDeploy,
  } = useShipDeployStore();
  const {
    map: playerMap,
    deployShip,
    addRedeployShipState,
    removeShip,
    removeRedeployShipState,
  } = usePlayerStore();

  const cleanupPreviousTiles = (previousTile: HTMLElement) => {
    const { coordinateX: strPrevX, coordinateY: strPrevY } = previousTile.dataset;
    const prevCoordinates = { x: Number(strPrevX), y: Number(strPrevY) };

    if (shipDeployId) {
      const shipLength = SHIP_TYPES[shipDeployId].length;
      const previousCoordinates = getNextCoordinates(prevCoordinates, shipLength, shipDeployOrientation);
      const previousTiles = getPlayerTilesByCoordinates(previousCoordinates);
      if (previousTiles) clearTilesAvailableStyles(previousTiles);
    }
  };

  const highlightNextTiles = (coordinates: TCoordinates, target: HTMLElement) => {
    if (!shipDeployId) return;

    const shipLength = SHIP_TYPES[shipDeployId].length;
    const nextCoordinates = getNextCoordinates(coordinates, shipLength, shipDeployOrientation);

    const isOutOfArea = nextCoordinates.length < shipLength;
    const isCoveredForAnotherShip = hasCoordinateCovered(nextCoordinates, playerMap, shipDeployId);

    const nextTiles = getPlayerTilesByCoordinates(nextCoordinates);
    if (!nextTiles) return;

    nextTiles.forEach((tile) => {
      tile.classList.add(tileCSS[isOutOfArea || isCoveredForAnotherShip ? "is-unavailable" : "is-available"]);
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

    const foundCoordinate = playerMap.find(
      ({ x, y }) => x === Number(coordinateX) && y === Number(coordinateY),
    );
    if (!foundCoordinate || !foundCoordinate.covered) return;

    const { shipId: targetShipId, orientation: targetShipOrientation } = foundCoordinate.covered;
    const [x, y] = locationXY;

    addRedeployShipState(targetShipId);
    setShipOnDeploy(targetShipId, targetShipOrientation);
    setCursorLocation({ left: x, top: y });
  };

  const handleDragMove = (
    target: HTMLElement,
    locationXY: [number, number],
    setCursorLocation: (cursorLocation: TCursorLocation) => void,
  ) => {
    const [x, y] = locationXY;
    setCursorLocation({ left: x, top: y });

    const { coordinateX: strCoordinateX, coordinateY: strCoordinateY } = target.dataset;
    if (!isTile(target) || !strCoordinateX || !strCoordinateY || !shipDeployId) {
      if (hoveredTile.current) {
        cleanupPreviousTiles(hoveredTile.current);
        hoveredTile.current = null;
      }
      return;
    }

    const coordinates = { x: Number(strCoordinateX), y: Number(strCoordinateY) };
    const isAnotherTile = hoveredTile.current && hoveredTile.current !== target;

    if (!hoveredTile.current || isAnotherTile) {
      if (isAnotherTile && hoveredTile.current) cleanupPreviousTiles(hoveredTile.current);

      highlightNextTiles(coordinates, target);
    }
  };

  const handleDragEnd = (target: HTMLElement, redeploy: boolean = false) => {
    const clearDeployAndState = () => {
      hoveredTile.current = null;
      clearShipOnDeploy();
    };

    const handleDeployShip = (shipId: TShipId, nextCoordinates: TCoordinates[]) => {
      if (redeploy) removeShip(shipId);
      const coveredCoordinates = getCoveredCoordinates(nextCoordinates, shipId, shipDeployOrientation);

      deployShip(shipId, coveredCoordinates);
      clearDeployAndState();
    };

    const { coordinateX: strCoordinateX, coordinateY: strCoordinateY } = target.dataset;

    if (!isTile(target) || !strCoordinateX || !strCoordinateY || !shipDeployId) {
      if (shipDeployId) removeRedeployShipState(shipDeployId);

      clearDeployAndState();
      return;
    }

    const coordinates = { x: Number(strCoordinateX), y: Number(strCoordinateY) };
    const shipLength = SHIP_TYPES[shipDeployId].length;

    const nextCoordinates = getNextCoordinates(coordinates, shipLength, shipDeployOrientation);
    const nextTiles = getPlayerTilesByCoordinates(nextCoordinates);

    const isCoveredForAnotherShip = hasCoordinateCovered(nextCoordinates, playerMap, shipDeployId);
    const isOutOfArea = nextCoordinates.length < shipLength;

    // ❌ Is unavailable | out-of-area location or location covered by another ship
    if (isOutOfArea || isCoveredForAnotherShip) {
      if (nextTiles) clearTilesAvailableStyles(nextTiles);
      if (shipDeployId) removeRedeployShipState(shipDeployId);
      clearDeployAndState();
      return;
    }

    // ✅ Is available
    handleDeployShip(shipDeployId, nextCoordinates);
    if (nextTiles) clearTilesAvailableStyles(nextTiles);
  };

  const handleDragCancel = () => {
    if (shipDeployId) removeRedeployShipState(shipDeployId);
    if (hoveredTile.current) cleanupPreviousTiles(hoveredTile.current);
    clearShipOnDeploy();
    hoveredTile.current = null;
  };

  const handleChangeDirection = (target: HTMLElement) => {
    const { coordinateX, coordinateY } = target.dataset;
    if (!isTile(target) || !coordinateX || !coordinateY) return;

    const foundCoordinate = playerMap.find(
      ({ x, y }) => x === Number(coordinateX) && y === Number(coordinateY),
    );
    if (!foundCoordinate || !foundCoordinate.covered) return;

    const { shipId: targetShipId, orientation } = foundCoordinate.covered;
    const shipLength = SHIP_TYPES[targetShipId].length;

    const shipCoordinates = playerMap.filter(({ covered }) => covered && covered.shipId === targetShipId);

    shipCoordinates.sort((coordinateA, coordinateB) => 
      orientation === "horizontal" ? 
      coordinateA.x - coordinateB.x : 
      coordinateA.y - coordinateB.y
    );

    const oppositeOrientation = orientation === "horizontal" ? "vertical" : "horizontal";

    const startCoordinates = { x: shipCoordinates[0].x, y: shipCoordinates[0].y };
    const newCoordinates = getNextCoordinates(startCoordinates, shipLength, oppositeOrientation);

    const isCoveredForAnotherShip = hasCoordinateCovered(newCoordinates, playerMap, targetShipId);
    const isOutOfArea = newCoordinates.length < shipLength;

    if (isOutOfArea || isCoveredForAnotherShip) {
      console.log("No se puede desplegar en esa nueva zona");
      // TODO: mostrar un indicativo visual
      return;
    }

    removeShip(targetShipId);

    const newCoveredCoordinates = getCoveredCoordinates(newCoordinates, targetShipId, oppositeOrientation);
    deployShip(targetShipId, newCoveredCoordinates);

    // TODO: agregar indicativo de como el usuario puede cambiar de direccion
    // TODO: retirar los comenmtarios y console.log y mandar a main remote
  };

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleReDragStart,
    handleDragCancel,
    handleChangeDirection,
  };
};
