import { ITileBaseProps } from "./tile.types";
import css from "./tile.module.css";
import clsx from "clsx";
import { getTileLabelByIndexes, getCoordinatesByIndexes } from "~/utils";

export const TileOpponent = ({ indexes, isCovered, isAttacked }: ITileBaseProps) => {
  const coordinates = getCoordinatesByIndexes(indexes);
  const tileLabel = getTileLabelByIndexes(indexes);

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
    <div className={combinedClasses} data-coordinate-x={coordinates.x} data-coordinate-y={coordinates.y}>
      <span className={css["BattleMap-tileText"]}>{tileLabel}</span>
    </div>
  );
};
