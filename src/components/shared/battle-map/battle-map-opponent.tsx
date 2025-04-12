import { IBattleMapOpponentProps } from "./battle-map.types";
import { TileOpponent } from "./tile";
import { Sight } from "./battle-map-sight";
import css from "./battle-map.module.css";
import { COORDINATES_LENGTH } from "~/constants";
import clsx from "clsx";
import { useGameStore, useOpponentStore, usePlayerStore } from "~/stores";

export const BattleMapOpponent = ({ className, onFinishesShot }: IBattleMapOpponentProps) => {
  const { targetCoordinates: opponentTargetCoordinates } = usePlayerStore();
  const { map: opponentMap } = useOpponentStore();
  const { gamePhase, isPlayerTurn, isShooting } = useGameStore();

  const isOpponentTurn = !isPlayerTurn;
  const isDisabled = gamePhase !== "start";
  const isReady = gamePhase === "start";

  const sideLength = COORDINATES_LENGTH;
  const lengthCSS = `calc(100% - 100% / ${sideLength + 1})`;

  const tiles = [];
  for (let column = 0; column <= sideLength; column++) {
    for (let row = 0; row <= sideLength; row++) {
      const mapCoordinateFound = opponentMap.find(({ x, y }) => x === row && y === column);

      tiles.push(
        <TileOpponent
          key={`${column}${row}`}
          coordinates={{ x: row, y: column }}
          isCovered={mapCoordinateFound ? mapCoordinateFound.covered : false}
          isAttacked={mapCoordinateFound ? mapCoordinateFound.attacked : false}
        />,
      );
    }
  }

  return (
    <section
      className={clsx(css["BattleMap"], isDisabled && css["is-disabled"], css["is-opponent"], className)}
      style={{ gridTemplateColumns: `repeat(${sideLength + 1}, auto)` }}
    >
      {tiles}

      <div className={css["BattleMap-background"]} style={{ width: lengthCSS, height: lengthCSS }}></div>

      {isReady && !isOpponentTurn && (
        <Sight
          targetCoordinates={opponentTargetCoordinates}
          isShooting={isShooting}
          isInTurn={isOpponentTurn}
          onFinishesShot={onFinishesShot}
        />
      )}
    </section>
  );
};
