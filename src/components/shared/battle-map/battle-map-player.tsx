import { type IBattleMapBaseProps } from "./battle-map.types";
import { TilePlayer } from "./tile";
import { Sight } from "./battle-map-sight";
import css from "./battle-map.module.css";
import { COORDINATES_LENGTH } from "~/constants";
import clsx from "clsx";
import { useGameStore, useOpponentStore, usePlayerStore } from "~/stores";
import { generateTiles } from "~/utils";

export const BattleMapPlayer = ({ className, onFinishesShot }: IBattleMapBaseProps) => {
  const { map: playerMap } = usePlayerStore();
  const { targetCoordinates: playerTargetCoordinates } = useOpponentStore();
  const { gamePhase, isPlayerTurn, isShooting } = useGameStore();

  const isReady = gamePhase === "start";
  const sideLength = COORDINATES_LENGTH;
  const lengthCSS = `calc(100% - 100% / ${sideLength + 1})`;

  // const handleContextMenuTile = (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   if (!shipOnDeployOrientation) return;
  //   const oppositeOrientation = toggleOrientation(shipOnDeployOrientation);
  //   setOrientation(oppositeOrientation);
  // };

  const tiles = generateTiles(playerMap, (tileProps) => <TilePlayer {...tileProps} key={tileProps.key} />);

  return (
    <section
      className={clsx(css["BattleMap"], className)}
      style={{ gridTemplateColumns: `repeat(${sideLength + 1}, auto)` }}
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
