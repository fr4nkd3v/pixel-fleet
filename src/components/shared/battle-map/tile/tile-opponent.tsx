import { ITileOpponentProps } from "./tile.types";
import css from "./tile.module.css";
import clsx from "clsx";
import { getTileLabelByCoordinates, isValidCoordinate } from "~/utils";

export const TileOpponent = ({ coordinates, isCovered, isAttacked }: ITileOpponentProps) => {
  const validCoordinate = isValidCoordinate(coordinates);
  const tileLabel = getTileLabelByCoordinates(coordinates);

  const { shipPart = "", orientation = "", isDefeated, isRedeploy } = isCovered || {};

  const combinedClasses = clsx(
    css["BattleMap-tile"],
    css["is-opponent"],
    isCovered && [css["is-covered"], css[shipPart], css[orientation]],
    isAttacked && css["is-attacked"],
    !isDefeated && css["is-hidden"],
    isRedeploy && css["is-redeploy"],
  );

  return (
    <div
      className={combinedClasses}
      data-coordinate-x={validCoordinate ? coordinates.x : undefined}
      data-coordinate-y={validCoordinate ? coordinates.y : undefined}
    >
      <span className={css["BattleMap-tileText"]}>{tileLabel}</span>
    </div>
  );
};
