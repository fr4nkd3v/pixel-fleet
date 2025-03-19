import { type ITileProps } from "./battle-map.types";
import css from "./battle-map.module.css";
import {
  getCoveredCoordinates,
  getNextCoordinates,
  hasCoordinateCovered,
  isValidCoordinate,
} from "~/utils/coordinates";
import clsx from "clsx";
import {
  clearTilesAvailableStyles,
  getPlayerTilesByCoordinates,
  isAxisXTile,
  isAxisYTile,
  isTile,
} from "~/utils";
import { TCoordinate, TShipId } from "~/types";
import { useGameStore, usePlayerStore, useShipDeployStore } from "~/stores";
import { useDrag } from "@use-gesture/react";
import { SHIP_TYPES } from "~/constants";
import { useRef } from "react";

export const Tile = ({
  coordinateX,
  coordinateY,
  isCovered,
  isAttacked,
  perspective,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
  setCursorLocation,
}: ITileProps) => {
  const hoveredTile = useRef<HTMLElement | null>(null);

  const { gamePhase } = useGameStore();
  const {
    setShipOnDeploy,
    shipId: shipDeployId,
    orientation: shipDeployOrientation,
    clearShipOnDeploy,
  } = useShipDeployStore();
  const { map: playerMap, deployShipInFleet, removeShipOnFeet } = usePlayerStore();

  const isPlayer = perspective === "player";
  const canChangePosition = Boolean(isPlayer && gamePhase === "prestart" && isCovered);

  const validCoordinate = isValidCoordinate(coordinateX, coordinateY);

  const coordinates: TCoordinate = { x: coordinateX, y: coordinateY };
  const text = isAxisYTile(coordinates)
    ? coordinateY.toString()
    : isAxisXTile(coordinates)
      ? coordinateX
      : null;

  const { shipPart = "", orientation = "", isDefeated } = isCovered || {};

  const combinedClasses = clsx(
    css["BattleMap-tile"],
    isPlayer ? css["is-player"] : css["is-opponent"],
    isCovered && [css["is-covered"], css[shipPart], css[orientation]],
    isAttacked && css["is-attacked"],
    !isPlayer && !isDefeated && css["is-hidden"],
  );

  const handlePointerDown = (target: HTMLElement, x: number, y: number) => {
    const { coordinateX, coordinateY } = target.dataset;
    if (!isTile(target) || !coordinateX || !coordinateY) return;

    const foundCoordinate = playerMap.find(({ x, y }) => x === coordinateX && y === Number(coordinateY));
    if (!foundCoordinate || !foundCoordinate.covered) return;

    const { shipId: targetShipId } = foundCoordinate.covered;

    setShipOnDeploy(targetShipId);
    setCursorLocation({ left: x, top: y });
  };

  const handlePointerMove = (target: HTMLElement, x: number, y: number) => {
    setCursorLocation({ left: x, top: y });

    const { coordinateX, coordinateY: strCoordinateY } = target.dataset;
    if (!isTile(target) || !shipDeployId || !coordinateX || !strCoordinateY) return;

    const coordinateY = Number(strCoordinateY);
    const shipLength = SHIP_TYPES[shipDeployId].length;

    const cleanupPreviousTiles = (previousTile: HTMLElement) => {
      const { coordinateX: prevX, coordinateY: strPrevY } = previousTile.dataset;
      const prevY = Number(strPrevY);

      if (prevX && prevY) {
        const coors = getNextCoordinates(prevX, prevY, shipLength, shipDeployOrientation);
        const prevTiles = getPlayerTilesByCoordinates(coors);
        if (prevTiles) clearTilesAvailableStyles(prevTiles);
      }
    };

    const highlightNextTiles = () => {
      const nextCoordinates = getNextCoordinates(coordinateX, coordinateY, shipLength, shipDeployOrientation);

      const isOutOfArea = nextCoordinates.length < shipLength;
      const isCovered = hasCoordinateCovered(nextCoordinates, playerMap);

      const nextTiles = getPlayerTilesByCoordinates(nextCoordinates);
      if (!nextTiles) return;

      nextTiles.forEach((tile) => {
        tile.classList.add(css[isOutOfArea || isCovered ? "is-unavailable" : "is-available"]);
      });

      hoveredTile.current = target as HTMLElement;
    };

    const isAnotherTile = hoveredTile.current && hoveredTile.current !== target;

    if (!hoveredTile.current || isAnotherTile) {
      if (isAnotherTile && hoveredTile.current) cleanupPreviousTiles(hoveredTile.current);

      highlightNextTiles();
    }
  };

  const handlePointerUp = (target: HTMLElement) => {
    const finishDeploy = () => {
      hoveredTile.current = null;
      clearShipOnDeploy();
    };

    const redeployShip = (nextCoordinates: TCoordinate[], shipId: TShipId) => {
      removeShipOnFeet(shipId);
      const coveredCoordinates = getCoveredCoordinates(nextCoordinates, shipId, shipDeployOrientation);

      deployShipInFleet(shipId, coveredCoordinates);
      finishDeploy();
    };

    const { coordinateX, coordinateY: strCoordinateY } = target.dataset;
    if (!isTile(target) || !shipDeployId || !coordinateX || !strCoordinateY) {
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
    redeployShip(nextCoordinates, shipDeployId);
    if (nexTiles) clearTilesAvailableStyles(nexTiles);
  };

  const bind = useDrag((state) => {
    const {
      xy: [x, y],
      type,
    } = state;

    if (!canChangePosition) return;

    const target = document.elementFromPoint(x, y);
    if (!target) return;

    if (type === "pointerdown") {
      handlePointerDown(target as HTMLElement, x, y);
    } else if (type === "pointermove") {
      handlePointerMove(target as HTMLElement, x, y);
    } else if (type === "pointerup") {
      handlePointerUp(target as HTMLElement);
    } else if (type === "pointercancel") {
      // Handle drag cancellation
    }

    return false; // Prevent default drag behavior
  });

  return (
    <div
      className={combinedClasses}
      data-coordinate-x={validCoordinate ? coordinateX : undefined}
      data-coordinate-y={validCoordinate ? coordinateY : undefined}
      onMouseEnter={validCoordinate ? onMouseEnter : undefined}
      onMouseLeave={validCoordinate ? onMouseLeave : undefined}
      onContextMenu={onContextMenu}
      {...bind()}
    >
      <span className={css["BattleMap-tileText"]}>{text}</span>
    </div>
  );
};
