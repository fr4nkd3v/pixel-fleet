import { useRef } from "react";
import { type IBattleMapProps } from "./BattleMap.types";
import { Tile } from "./Tile";
import { Sight } from "./Sight";
import styles from "./BattleMap.module.css";
import {
  getNextCoordinates,
  getTilesByCoordinates,
  hasCoordinateCovered,
  parseStringCoordinateX,
  toggleOrientation,
} from "~/utils";
import { MAP_SIZE, SHIP_TYPES } from "~/constants";
import { TOrientationType } from "~/types";

export const BattleMap = ({
  mapCoordinates,
  currentShipOnDeploy,
  disabled = false,
  targetCoordinates,
  isReady,
  isShooting,
  isInTurn,
  onDeployedShip,
  onChangeOrientation,
  onChangeCursorLocation,
  onFinishesShot,
}: IBattleMapProps) => {
  const sideLength = MAP_SIZE;
  const battleMapRef = useRef<null | HTMLElement>(null);

  const clearAvailableStyles = (tiles: HTMLElement[] | NodeListOf<Element>) => {
    tiles.forEach((tile) =>
      tile.classList.remove(styles["is-available"], styles["is-unavailable"])
    );
  };
  const handleMouseEnterAndLeaveTile = (
    event: React.MouseEvent,
    action: "enter" | "leave",
    forcedOrientation?: TOrientationType
  ) => {
    if (!(currentShipOnDeploy.shipId && currentShipOnDeploy.orientation))
      return;

    const { locationX, locationY } = (event.target as HTMLElement).dataset;
    if (!locationX || !locationY) return;

    const length: number = SHIP_TYPES[currentShipOnDeploy.shipId].length;
    const nextCoordinates = getNextCoordinates(
      locationX,
      Number(locationY),
      length,
      forcedOrientation || currentShipOnDeploy.orientation
    );

    const isOutOfArea = nextCoordinates.length < length;
    const isCovered = hasCoordinateCovered(nextCoordinates, mapCoordinates);
    const tiles = getTilesByCoordinates(nextCoordinates);

    if (action === "enter") {
      tiles.forEach((tile) =>
        tile.classList.add(
          styles[isOutOfArea || isCovered ? "is-unavailable" : "is-available"]
        )
      );
    } else if (action === "leave") {
      clearAvailableStyles(tiles);
    }
  };

  const handleContextMenuTile = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!currentShipOnDeploy.orientation) return;
    const oppositeOrientation = toggleOrientation(
      currentShipOnDeploy.orientation
    );
    onChangeOrientation(oppositeOrientation);

    if (!battleMapRef.current) return;
    const tiles = battleMapRef.current.querySelectorAll(
      `.${styles["BattleMap-tile"]}.${styles["is-available"]}, .${styles["BattleMap-tile"]}.${styles["is-unavailable"]}`
    );
    clearAvailableStyles(tiles);
    handleMouseEnterAndLeaveTile(event, "enter", oppositeOrientation);
  };

  const handleClickBattleMap = (event: React.MouseEvent) => {
    // Validate data & elements
    if (!(currentShipOnDeploy.shipId && currentShipOnDeploy.orientation))
      return;

    const childTile = (event.target as Element).closest(
      `.${styles["BattleMap-tile"]}`
    );
    if (!childTile) return;

    const { locationX, locationY } = (childTile as HTMLElement).dataset;
    if (!locationX || !locationY) return;

    // Get coordinates that form the ship deployed
    const length: number = SHIP_TYPES[currentShipOnDeploy.shipId].length;
    const nextCoordinates = getNextCoordinates(
      locationX,
      Number(locationY),
      length,
      currentShipOnDeploy.orientation
    );
    if (nextCoordinates.length < length) return; // ❌ Is unavailable | out-of-area location

    const isCovered = hasCoordinateCovered(nextCoordinates, mapCoordinates);
    if (isCovered) return; // ❌ Is unavailable | location covered by another ship

    // ✅ Is available
    onDeployedShip(
      currentShipOnDeploy.shipId,
      locationX,
      Number(locationY),
      currentShipOnDeploy.orientation
    );
    const tiles = getTilesByCoordinates(nextCoordinates);
    clearAvailableStyles(tiles);
  };

  const handleMouseMoveBattleMap = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    onChangeCursorLocation({ left: clientX, top: clientY });
  };

  const tiles = [];
  for (let h = 0; h <= sideLength; h++) {
    for (let w = 0; w <= sideLength; w++) {
      const mapCoorFound = mapCoordinates.find(
        ({ x, y }) => x === parseStringCoordinateX(w) && y === h
      );
      tiles.push(
        <Tile
          key={`${h}${w}`}
          locationX={w}
          locationY={h}
          isCovered={mapCoorFound ? mapCoorFound.covered : false}
          isAttacked={mapCoorFound ? mapCoorFound.attacked : false}
          onMouseEnter={(event) => handleMouseEnterAndLeaveTile(event, "enter")}
          onMouseLeave={(event) => handleMouseEnterAndLeaveTile(event, "leave")}
          onContextMenu={handleContextMenuTile}
        />
      );
    }
  }

  return (
    <section
      className={`${styles["BattleMap"]} ${
        disabled ? styles["is-disabled"] : ""
      }`}
      style={{
        gridTemplateColumns: `repeat(${sideLength + 1}, var(--tile-size))`,
        gridTemplateRows: `repeat(${sideLength + 1}, var(--tile-size))`,
      }}
      onClick={handleClickBattleMap}
      onMouseMove={handleMouseMoveBattleMap}
      ref={battleMapRef}
    >
      {tiles}
      <div
        className={styles["BattleMap-background"]}
        style={{
          width: `calc(var(--tile-size) * ${sideLength})`,
          height: `calc(var(--tile-size) * ${sideLength})`,
        }}
      ></div>
      {isReady && isInTurn && targetCoordinates && (
        <Sight
          targetCoordinates={targetCoordinates}
          isShooting={isShooting}
          isInTurn={isInTurn}
          onFinishesShot={onFinishesShot}
        />
      )}
    </section>
  );
};
