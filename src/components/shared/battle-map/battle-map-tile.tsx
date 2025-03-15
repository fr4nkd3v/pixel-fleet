import { type ITileProps } from "./battle-map.types";
import css from "./battle-map.module.css";
import { isValidCoordinate, parseNumberCoordinateX } from "~/utils/coordinates";
import clsx from "clsx";

export const Tile = ({
  coordinateX,
  coordinateY,
  isCovered,
  isAttacked,
  perspective,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: ITileProps) => {
  const isPlayer = perspective === "player";

  const validCoordinate = isValidCoordinate(coordinateX, coordinateY);
  const numberCoordinateX = parseNumberCoordinateX(coordinateX);

  let text = null;
  if (numberCoordinateX === 0 && coordinateY > 0 && coordinateY < 11) {
    text = coordinateY.toString();
  } else if (
    coordinateY === 0 &&
    numberCoordinateX > 0 &&
    numberCoordinateX < 11
  ) {
    text = coordinateX;
  }

  const { shipPart = "", orientation = "", isDefeated } = isCovered || {};

  const combinedClasses = clsx(
    css["BattleMap-tile"],
    isPlayer ? css["is-player"] : css["is-opponent"],
    isCovered && [css["is-covered"], css[shipPart], css[orientation]],
    isAttacked && css["is-attacked"],
    !isPlayer && !isDefeated && css["is-hidden"]
  );

  return (
    <div
      className={combinedClasses}
      data-coordinate-x={validCoordinate ? coordinateX : undefined}
      data-coordinate-y={validCoordinate ? coordinateY : undefined}
      onMouseEnter={validCoordinate ? onMouseEnter : undefined}
      onMouseLeave={validCoordinate ? onMouseLeave : undefined}
      onContextMenu={onContextMenu}
    >
      <span className={css["BattleMap-tileText"]}>{text}</span>
    </div>
  );
};
