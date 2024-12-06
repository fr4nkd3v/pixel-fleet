import { type ITileProps } from "./battle-map.types";
import css from "./battle-map.module.css";
import { isValidCoordinate, parseStringCoordinateX } from "~/utils/coordinates";
import clsx from "clsx";

export const Tile = ({
  locationX,
  locationY,
  isCovered,
  isAttacked,
  isHidden = false,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: ITileProps) => {
  const coordinateX = parseStringCoordinateX(locationX);
  const validCoordinate = isValidCoordinate(coordinateX, locationY);
  const id = validCoordinate ? `${locationY}${coordinateX}` : undefined;

  let text = null;
  if (locationX === 0 && locationY > 0 && locationY < 11) {
    text = locationY.toString();
  } else if (locationY === 0 && locationX > 0 && locationX < 11) {
    text = coordinateX;
  }

  const { shipPart = "", orientation = "", isDefeated } = isCovered || {};

  const combinedClasses = clsx(
    css["BattleMap-tile"],
    isCovered && [css["is-covered"], css[shipPart], css[orientation]],
    isAttacked && css["is-attacked"],
    isHidden && !isDefeated && css["is-hidden"]
  );

  return (
    <div
      id={id}
      className={combinedClasses}
      data-location-x={validCoordinate ? coordinateX : undefined}
      data-location-y={validCoordinate ? locationY : undefined}
      onMouseEnter={validCoordinate ? onMouseEnter : undefined}
      onMouseLeave={validCoordinate ? onMouseLeave : undefined}
      onContextMenu={onContextMenu}
    >
      {text}
    </div>
  );
};
