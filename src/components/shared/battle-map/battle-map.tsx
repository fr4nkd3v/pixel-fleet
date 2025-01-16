import { useRef } from "react";
import { type IBattleMapProps } from "./battle-map.types";
import { Tile } from "./battle-map-tile";
import { Sight } from "./battle-map-sight";
import css from "./battle-map.module.css";
import {
  getNextCoordinates,
  getShipPartByIndex,
  getTilesByCoordinates,
  hasCoordinateCovered,
  parseStringCoordinateX,
  toggleOrientation,
} from "~/utils";
import { MAP_SIZE, SHIP_TYPES } from "~/constants";
import { TMap, TOrientationType, TShipId } from "~/types";
import clsx from "clsx";
import {
  useGameStore,
  useOpponentStore,
  usePlayerStore,
  useShipDeployStore,
} from "~/stores";

export const BattleMap = ({
  perspective,
  className,
  setCursorLocation,
  onFinishesShot,
}: IBattleMapProps) => {
  const {
    map: playerMap,
    targetCoordinates: opponentTargetCoordinates,
    deployShipInFleet,
  } = usePlayerStore();
  const { map: opponentMap, targetCoordinates: playerTargetCoordinates } =
    useOpponentStore();
  const {
    shipId: shipOnDeployId,
    orientation: shipOnDeployOrientation,
    hasShipOnDeploy,
    clearShipOnDeploy,
    setOrientation,
  } = useShipDeployStore();
  const { gamePhase, isPlayerTurn, isShooting } = useGameStore();

  const isPlayer = perspective === "player";

  const mapCoordinates = isPlayer ? playerMap : opponentMap;
  const targetCoordinates = isPlayer
    ? playerTargetCoordinates
    : opponentTargetCoordinates;
  const isInTurn = isPlayer ? !isPlayerTurn : isPlayerTurn;
  const isDisabled = !isPlayer && gamePhase !== "start";
  const isReady = gamePhase === "start";

  const sideLength = MAP_SIZE;
  const battleMapRef = useRef<null | HTMLElement>(null);

  const clearAvailableStyles = (tiles: HTMLElement[] | NodeListOf<Element>) => {
    tiles.forEach((tile) =>
      tile.classList.remove(css["is-available"], css["is-unavailable"])
    );
  };

  const handleDeployedShip = (
    shipId: TShipId,
    locationX: string,
    locationY: number,
    orientation: TOrientationType
  ) => {
    if (!hasShipOnDeploy) return;

    const nextCoordinates = getNextCoordinates(
      locationX,
      Number(locationY),
      SHIP_TYPES[shipId].length,
      shipOnDeployOrientation
    );
    const coveredCoordinates: TMap = nextCoordinates.map(
      (coordinate, index) => {
        const shipPart = getShipPartByIndex(index, nextCoordinates.length);
        return {
          x: coordinate.x,
          y: Number(coordinate.y),
          covered: {
            shipId,
            orientation,
            shipPart,
            isDefeated: false,
          },
          attacked: false,
        };
      }
    );

    deployShipInFleet(shipId, coveredCoordinates);
    clearShipOnDeploy();
  };

  const handleMouseEnterAndLeaveTile = (
    event: React.MouseEvent,
    action: "enter" | "leave",
    forcedOrientation?: TOrientationType
  ) => {
    if (!(shipOnDeployId && shipOnDeployOrientation)) return;

    const { locationX, locationY } = (event.target as HTMLElement).dataset;
    if (!locationX || !locationY) return;

    const length: number = SHIP_TYPES[shipOnDeployId].length;
    const nextCoordinates = getNextCoordinates(
      locationX,
      Number(locationY),
      length,
      forcedOrientation || shipOnDeployOrientation
    );

    const isOutOfArea = nextCoordinates.length < length;
    const isCovered = hasCoordinateCovered(nextCoordinates, mapCoordinates);
    const tiles = getTilesByCoordinates(nextCoordinates);

    if (action === "enter") {
      tiles.forEach((tile) =>
        tile.classList.add(
          css[isOutOfArea || isCovered ? "is-unavailable" : "is-available"]
        )
      );
    } else if (action === "leave") {
      clearAvailableStyles(tiles);
    }
  };

  const handleContextMenuTile = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!shipOnDeployOrientation) return;
    const oppositeOrientation = toggleOrientation(shipOnDeployOrientation);
    setOrientation(oppositeOrientation);

    if (!battleMapRef.current) return;
    const tiles = battleMapRef.current.querySelectorAll(
      `.${css["BattleMap-tile"]}.${css["is-available"]}, .${css["BattleMap-tile"]}.${css["is-unavailable"]}`
    );
    clearAvailableStyles(tiles);
    handleMouseEnterAndLeaveTile(event, "enter", oppositeOrientation);
  };

  const handleClickBattleMap = (event: React.MouseEvent) => {
    // Validate data & elements
    if (!(shipOnDeployId && shipOnDeployOrientation)) return;

    const childTile = (event.target as Element).closest(
      `.${css["BattleMap-tile"]}`
    );
    if (!childTile) return;

    const { locationX, locationY } = (childTile as HTMLElement).dataset;
    if (!locationX || !locationY) return;

    // Get coordinates that form the ship deployed
    const length: number = SHIP_TYPES[shipOnDeployId].length;
    const nextCoordinates = getNextCoordinates(
      locationX,
      Number(locationY),
      length,
      shipOnDeployOrientation
    );
    if (nextCoordinates.length < length) return; // ❌ Is unavailable | out-of-area location

    const isCovered = hasCoordinateCovered(nextCoordinates, mapCoordinates);
    if (isCovered) return; // ❌ Is unavailable | location covered by another ship

    // ✅ Is available
    handleDeployedShip(
      shipOnDeployId,
      locationX,
      Number(locationY),
      shipOnDeployOrientation
    );
    const tiles = getTilesByCoordinates(nextCoordinates);
    clearAvailableStyles(tiles);
  };

  const handleMouseMoveBattleMap = (event: React.MouseEvent) => {
    if (!setCursorLocation) return;

    const { clientX, clientY } = event;
    setCursorLocation({ left: clientX, top: clientY });
  };

  const tiles = [];
  for (let h = 0; h <= sideLength; h++) {
    for (let w = 0; w <= sideLength; w++) {
      const mapCoordinateFound = mapCoordinates.find(
        ({ x, y }) => x === parseStringCoordinateX(w) && y === h
      );
      tiles.push(
        <Tile
          key={`${h}${w}`}
          locationX={w}
          locationY={h}
          isCovered={mapCoordinateFound ? mapCoordinateFound.covered : false}
          isAttacked={mapCoordinateFound ? mapCoordinateFound.attacked : false}
          perspective={perspective}
          onMouseEnter={(event) => handleMouseEnterAndLeaveTile(event, "enter")}
          onMouseLeave={(event) => handleMouseEnterAndLeaveTile(event, "leave")}
          onContextMenu={handleContextMenuTile}
        />
      );
    }
  }

  return (
    <section
      className={clsx(
        css["BattleMap"],
        isDisabled && css["is-disabled"],
        !isPlayer && css["is-opponent"],
        className
      )}
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
        className={css["BattleMap-background"]}
        style={{
          width: `calc(var(--tile-size) * ${sideLength})`,
          height: `calc(var(--tile-size) * ${sideLength})`,
        }}
      ></div>

      {isReady && isInTurn && (
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
