import { ITileOpponentProps } from "./tile.types";
import css from "./tile.module.css";
import clsx from "clsx";
import { isAxisXTile, isAxisYTile, isValidCoordinate } from "~/utils";
import { TCoordinate } from "~/types";

export const TileOpponent = ({ coordinateX, coordinateY, isCovered, isAttacked }: ITileOpponentProps) => {
  const validCoordinate = isValidCoordinate(coordinateX, coordinateY);

  const coordinates: TCoordinate = { x: coordinateX, y: coordinateY };
  const text = isAxisYTile(coordinates)
    ? coordinateY.toString()
    : isAxisXTile(coordinates)
      ? coordinateX
      : null;

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
      data-coordinate-x={validCoordinate ? coordinateX : undefined}
      data-coordinate-y={validCoordinate ? coordinateY : undefined}
    >
      <span className={css["BattleMap-tileText"]}>{text}</span>
    </div>
  );
};
