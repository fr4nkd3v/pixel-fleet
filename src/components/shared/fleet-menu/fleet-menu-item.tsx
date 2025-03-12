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
  getTilesByCoordinates,
  hasCoordinateCovered,
} from "~/utils";
import { TMap, TOrientationType, TShipId } from "~/types";
import battleMapCSS from "~/components/shared/battle-map/battle-map.module.css";
import { useRef } from "react";

export const FleetMenuItem = ({
  shipData,
  perspective,
  shipOnDeployId,
  onDeploying,
  setCursorLocation,
}: IFleetMenuItemProps) => {
  const hoveredTile = useRef<Element | null>(null);

  const { t } = useTranslation();
  const {
    orientation: shipOnDeployOrientation,
    clearShipOnDeploy,
    hasShipOnDeploy,
  } = useShipDeployStore();
  const { deployShipInFleet, map: playerMap } = usePlayerStore();
  const { map: opponentMap } = useOpponentStore();

  const isPlayer = perspective === "player";

  const { id: shipId, health: currentHealth, isDeployed } = shipData;
  const fullHealth = SHIP_TYPES[shipId].length;

  const mapCoordinates = isPlayer ? playerMap : opponentMap;

  const lives = Array.from({ length: fullHealth }, (_, index) => {
    const cssIsDead =
      (!isPlayer && currentHealth === 0) || (isPlayer && index >= currentHealth)
        ? css["is-dead"]
        : null;
    const combinedClasses = clsx(css["FleetMenuItem-live"], cssIsDead);
    return <div className={combinedClasses} key={index}></div>;
  });

  let combinedClasses = "";
  if (isPlayer) {
    combinedClasses = clsx(
      css["FleetMenuItem"],
      isDeployed && shipOnDeployId !== shipId && css["is-deployed"],
      !isDeployed && shipOnDeployId !== shipId && css["not-deployed"],
      shipOnDeployId === shipId && css["is-deploying"]
    );
  } else {
    combinedClasses = clsx(
      css["FleetMenuItem"],
      isDeployed && css["is-deployed"],
      !isDeployed && css["not-deployed"]
    );
  }

  const handleDeployedShip = (
    shipId: TShipId,
    coordinateX: string,
    coordinateY: number,
    orientation: TOrientationType
  ) => {
    if (!hasShipOnDeploy) return;

    const nextCoordinates = getNextCoordinates(
      coordinateX,
      Number(coordinateY),
      SHIP_TYPES[shipId].length,
      shipOnDeployOrientation
    );

    const coveredCoordinates = getCoveredCoordinates(
      nextCoordinates,
      shipId,
      orientation
    );

    deployShipInFleet(shipId, coveredCoordinates);
    clearShipOnDeploy();
  };

  const handlePointerMove = (target: Element | null, mapCoordinates: TMap) => {
    if (!(shipOnDeployId && shipOnDeployOrientation) || !target) return;

    const shipLength: number = SHIP_TYPES[shipOnDeployId].length;

    if (!target.classList.contains(battleMapCSS["BattleMap-tile"])) return;

    const { locationX, locationY } = (target as HTMLElement).dataset;
    if (!locationX || !locationY) return;

    if (hoveredTile.current && hoveredTile.current !== target) {
      const { locationX: previousLocationX, locationY: previousLocationY } = (
        hoveredTile.current as HTMLElement
      ).dataset;

      if (previousLocationX && previousLocationY) {
        const previousNextCoordinates = getNextCoordinates(
          previousLocationX,
          Number(previousLocationY),
          shipLength,
          shipOnDeployOrientation
        );

        const previousTiles = getTilesByCoordinates(previousNextCoordinates);
        clearTilesAvailableStyles(previousTiles);
      }
    }

    if (
      !hoveredTile.current ||
      (hoveredTile.current && hoveredTile.current !== target)
    ) {
      const nextCoordinates = getNextCoordinates(
        locationX,
        Number(locationY),
        shipLength,
        shipOnDeployOrientation
      );

      const isOutOfArea = nextCoordinates.length < shipLength;
      const isCovered = hasCoordinateCovered(nextCoordinates, mapCoordinates);

      const nextTiles = getTilesByCoordinates(nextCoordinates);

      nextTiles.forEach((tile) => {
        tile.classList.add(
          battleMapCSS[
            isOutOfArea || isCovered ? "is-unavailable" : "is-available"
          ]
        );
      });

      hoveredTile.current = target;
    }
  };

  const handlePointerUp = (target: Element | null, mapCoordinates: TMap) => {
    if (
      !shipOnDeployId ||
      !shipOnDeployOrientation ||
      !target ||
      !target.classList.contains(battleMapCSS["BattleMap-tile"])
    ) {
      clearShipOnDeploy();
      return;
    }

    const { locationX, locationY } = (target as HTMLElement).dataset;
    if (!locationX || !locationY) return;

    // Get coordinates that form the ship deployed
    const length: number = SHIP_TYPES[shipOnDeployId].length;
    const nextCoordinates = getNextCoordinates(
      locationX,
      Number(locationY),
      length,
      shipOnDeployOrientation
    );
    const nexTiles = getTilesByCoordinates(nextCoordinates);

    const isCovered = hasCoordinateCovered(nextCoordinates, mapCoordinates);

    // ❌ Is unavailable | out-of-area location or location covered by another ship
    if (nextCoordinates.length < length || isCovered) {
      clearShipOnDeploy();
      clearTilesAvailableStyles(nexTiles);
      return;
    }

    // ✅ Is available
    handleDeployedShip(
      shipOnDeployId,
      locationX,
      Number(locationY),
      shipOnDeployOrientation
    );
    clearTilesAvailableStyles(nexTiles);
  };

  const bind = useDrag((state) => {
    const {
      xy: [x, y],
      type,
    } = state;

    if (isDeployed) return;

    const target = document.elementFromPoint(x, y);

    if (type === "pointerdown") {
      onDeploying(shipId, { locationX: x, locationY: y });
    } else if (type === "pointermove") {
      setCursorLocation({
        left: x,
        top: y,
      });
      handlePointerMove(target, mapCoordinates);
    } else if (type === "pointerup") {
      handlePointerUp(target, mapCoordinates);
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
        <div className={css["FleetMenuItem-health"]}>
          {isPlayer ? lives : "???"}
        </div>
      </div>
    </div>
  );
};
