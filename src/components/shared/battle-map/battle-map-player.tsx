import { useRef } from "react";
import { type IBattleMapPlayerProps } from "./battle-map.types";
import { TilePlayer } from "./tile";
import { Sight } from "./battle-map-sight";
import css from "./battle-map.module.css";
import { parseStringCoordinateX } from "~/utils";
import { COORDINATES_LENGTH } from "~/constants";
import clsx from "clsx";
import { useGameStore, useOpponentStore, usePlayerStore } from "~/stores";

export const BattleMapPlayer = ({ className, onFinishesShot, setCursorLocation }: IBattleMapPlayerProps) => {
  const { map: playerMap } = usePlayerStore();
  const { targetCoordinates: playerTargetCoordinates } = useOpponentStore();
  const { gamePhase, isPlayerTurn, isShooting } = useGameStore();
  const battleMapRef = useRef<null | HTMLElement>(null);

  const isReady = gamePhase === "start";
  const sideLength = COORDINATES_LENGTH;
  const lengthCSS = `calc(100% - 100% / ${sideLength + 1})`;

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
      const mapCoordinateFound = playerMap.find(({ x, y }) => x === parseStringCoordinateX(w) && y === h);

      tiles.push(
        <TilePlayer
          key={`${h}${w}`}
          coordinateX={parseStringCoordinateX(w)}
          coordinateY={h}
          isCovered={mapCoordinateFound ? mapCoordinateFound.covered : false}
          isAttacked={mapCoordinateFound ? mapCoordinateFound.attacked : false}
          setCursorLocation={setCursorLocation}
        />,
      );
    }
  }

  return (
    <section
      className={clsx(css["BattleMap"], className)}
      style={{ gridTemplateColumns: `repeat(${sideLength + 1}, auto)` }}
      ref={battleMapRef}
    >
      {tiles}

      <div className={css["BattleMap-background"]} style={{ width: lengthCSS, height: lengthCSS }}></div>

      {isReady && !isPlayerTurn && (
        <Sight
          targetCoordinates={playerTargetCoordinates}
          isShooting={isShooting}
          isInTurn={isPlayerTurn}
          onFinishesShot={onFinishesShot}
        />
      )}
    </section>
  );
};
