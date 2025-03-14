import { type ITileProps } from "./battle-map.types";
import css from "./battle-map.module.css";
import { isValidCoordinate, parseStringCoordinateX } from "~/utils/coordinates";
import clsx from "clsx";

export const Tile = ({
  locationX,
  locationY,
  isCovered,
  isAttacked,
  perspective,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: ITileProps) => {
  const isPlayer = perspective === "player";

  const coordinateX = parseStringCoordinateX(locationX);
  const validCoordinate = isValidCoordinate(coordinateX, locationY);

  let text = null;
  if (locationX === 0 && locationY > 0 && locationY < 11) {
    text = locationY.toString();
  } else if (locationY === 0 && locationX > 0 && locationX < 11) {
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
      data-location-x={validCoordinate ? coordinateX : undefined}
      data-location-y={validCoordinate ? locationY : undefined}
      onMouseEnter={validCoordinate ? onMouseEnter : undefined}
      onMouseLeave={validCoordinate ? onMouseLeave : undefined}
      onContextMenu={onContextMenu}
    >
      <span className={css["BattleMap-tileText"]}>{text}</span>
    </div>
  );
};
