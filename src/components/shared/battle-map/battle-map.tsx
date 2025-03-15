import { useRef } from "react";
import { type IBattleMapProps } from "./battle-map.types";
import { Tile } from "./battle-map-tile";
import { Sight } from "./battle-map-sight";
import css from "./battle-map.module.css";
import { parseStringCoordinateX } from "~/utils";
import { MAP_SIZE } from "~/constants";
import clsx from "clsx";
import { useGameStore, useOpponentStore, usePlayerStore } from "~/stores";

export const BattleMap = ({
  perspective,
  className,
  onFinishesShot,
}: IBattleMapProps) => {
  const { map: playerMap, targetCoordinates: opponentTargetCoordinates } =
    usePlayerStore();
  const { map: opponentMap, targetCoordinates: playerTargetCoordinates } =
    useOpponentStore();
  const { gamePhase, isPlayerTurn, isShooting } = useGameStore();

  const isPlayer = perspective === "player";

  const mapCoordinates = isPlayer ? playerMap : opponentMap;
  const targetCoordinates = isPlayer
    ? playerTargetCoordinates
    : opponentTargetCoordinates;
  const isInTurn = isPlayer ? isPlayerTurn : !isPlayerTurn;
  const isDisabled = !isPlayer && gamePhase !== "start";
  const isReady = gamePhase === "start";

  const sideLength = MAP_SIZE;
  const battleMapRef = useRef<null | HTMLElement>(null);

  // const handleContextMenuTile = (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   if (!shipOnDeployOrientation) return;
  //   const oppositeOrientation = toggleOrientation(shipOnDeployOrientation);
  //   setOrientation(oppositeOrientation);

  //   if (!battleMapRef.current) return;
  //   const tiles = battleMapRef.current.querySelectorAll(
  //     `.${css["BattleMap-tile"]}.${css["is-available"]}, .${css["BattleMap-tile"]}.${css["is-unavailable"]}`
  //   );
  //   clearAvailableStyles(tiles);
  //   // handleMouseEnterAndLeaveTile(event, "enter", oppositeOrientation);
  // };

  const tiles = [];
  for (let h = 0; h <= sideLength; h++) {
    for (let w = 0; w <= sideLength; w++) {
      const mapCoordinateFound = mapCoordinates.find(
        ({ x, y }) => x === parseStringCoordinateX(w) && y === h
      );

      tiles.push(
        <Tile
          key={`${h}${w}`}
          coordinateX={parseStringCoordinateX(w)}
          coordinateY={h}
          isCovered={mapCoordinateFound ? mapCoordinateFound.covered : false}
          isAttacked={mapCoordinateFound ? mapCoordinateFound.attacked : false}
          perspective={perspective}
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
        gridTemplateColumns: `repeat(${sideLength + 1}, auto)`,
      }}
      ref={battleMapRef}
    >
      {tiles}
      <div
        className={css["BattleMap-background"]}
        style={{
          width: `calc(100% - 100% / ${sideLength + 1})`,
          height: `calc(100% - 100% / ${sideLength + 1})`,
        }}
      ></div>

      {isReady && !isInTurn && (
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
