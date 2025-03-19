import type { IFleetMenuItemProps } from "./fleet-menu.types";
import { SHIP_TYPES } from "~/constants/game";
import { Icon } from "~/components/shared/icon";
import css from "./fleet-menu.module.css";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useDrag } from "@use-gesture/react";
import { useOpponentStore, usePlayerStore, useShipDeployStore } from "~/stores";
import {
  clearTilesAvailableStyles,
  getCoveredCoordinates,
  getNextCoordinates,
  getPlayerTilesByCoordinates,
  hasCoordinateCovered,
  isTile,
} from "~/utils";
import { TCoordinate, TShipId } from "~/types";
import battleMapCSS from "~/components/shared/battle-map/battle-map.module.css";
import { useRef } from "react";

export const FleetMenuItem = ({
  shipData,
  perspective,
  shipOnDeployId,
  onDeploying,
  setCursorLocation,
}: IFleetMenuItemProps) => {
  const hoveredTile = useRef<HTMLElement | null>(null);

  const { t } = useTranslation();
  const { orientation: shipDeployOrientation, clearShipOnDeploy } = useShipDeployStore();
  const { deployShipInFleet, map: playerMap } = usePlayerStore();
  const { map: opponentMap } = useOpponentStore();

  const isPlayer = perspective === "player";

  const { id: shipId, health: currentHealth, isDeployed } = shipData;
  const fullHealth = SHIP_TYPES[shipId].length;

  const mapCoordinates = isPlayer ? playerMap : opponentMap;

  const lives = Array.from({ length: fullHealth }, (_, index) => {
    const cssIsDead =
      ((!isPlayer && currentHealth === 0) || (isPlayer && index >= currentHealth)) && css["is-dead"];
    const combinedClasses = clsx(css["FleetMenuItem-live"], cssIsDead);
    return <div className={combinedClasses} key={index}></div>;
  });

  const combinedClasses = isPlayer
    ? clsx(
        css["FleetMenuItem"],
        isDeployed && shipOnDeployId !== shipId && css["is-deployed"],
        !isDeployed && shipOnDeployId !== shipId && css["not-deployed"],
        shipOnDeployId === shipId && css["is-deploying"],
      )
    : clsx(css["FleetMenuItem"], isDeployed && css["is-deployed"], !isDeployed && css["not-deployed"]);

  const handlePointerMove = (target: HTMLElement, x: number, y: number) => {
    setCursorLocation({ left: x, top: y });

    const { coordinateX, coordinateY: strCoordinateY } = target.dataset;
    if (!isTile(target) || !shipOnDeployId || !coordinateX || !strCoordinateY) return;

    const coordinateY = Number(strCoordinateY);
    const shipLength = SHIP_TYPES[shipOnDeployId].length;

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
      const isCovered = hasCoordinateCovered(nextCoordinates, mapCoordinates);

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

  const handlePointerUp = (target: HTMLElement) => {
    const deployShip = (shipId: TShipId, nextCoordinates: TCoordinate[]) => {
      const coveredCoordinates = getCoveredCoordinates(nextCoordinates, shipId, shipDeployOrientation);

      deployShipInFleet(shipId, coveredCoordinates);
      clearShipOnDeploy();
    };

    const { coordinateX, coordinateY: strCoordinateY } = target.dataset;

    if (!isTile(target) || !shipOnDeployId || !coordinateX || !strCoordinateY) {
      clearShipOnDeploy();
      return;
    }

    const coordinateY = Number(strCoordinateY);
    const shipLength = SHIP_TYPES[shipOnDeployId].length;

    // Get coordinates that form the ship deployed
    const nextCoordinates = getNextCoordinates(coordinateX, coordinateY, shipLength, shipDeployOrientation);
    const nexTiles = getPlayerTilesByCoordinates(nextCoordinates);

    const isCovered = hasCoordinateCovered(nextCoordinates, mapCoordinates);
    const isOutOfArea = nextCoordinates.length < shipLength;

    // ❌ Is unavailable | out-of-area location or location covered by another ship
    if (isOutOfArea || isCovered) {
      clearShipOnDeploy();
      if (nexTiles) clearTilesAvailableStyles(nexTiles);
      return;
    }

    // ✅ Is available
    deployShip(shipOnDeployId, nextCoordinates);
    if (nexTiles) clearTilesAvailableStyles(nexTiles);
  };

  const bind = useDrag((state) => {
    const {
      xy: [x, y],
      type,
    } = state;

    if (isDeployed) return;

    const target = document.elementFromPoint(x, y);
    if (!target) return;

    if (type === "pointerdown") {
      onDeploying(shipId, { locationX: x, locationY: y });
    } else if (type === "pointermove") {
      handlePointerMove(target as HTMLElement, x, y);
    } else if (type === "pointerup") {
      handlePointerUp(target as HTMLElement);
    }
  });

  return (
    <div className={css["FleetMenuItem-wrapper"]} {...bind()}>
      <div className={css["FleetMenuItem-back"]}></div>
      <div className={combinedClasses}>
        <div className={css["FleetMenuItem-icon"]}>
          <Icon size="100%" name="ship" />
        </div>
        <div className={css["FleetMenuItem-name"]}>
          {isPlayer ? SHIP_TYPES[shipId].name : t("game:unidentified")}
        </div>
        <div className={css["FleetMenuItem-health"]}>{isPlayer ? lives : "???"}</div>
      </div>
    </div>
  );
};
