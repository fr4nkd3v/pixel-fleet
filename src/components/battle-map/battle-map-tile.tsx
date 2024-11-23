import { type ITileProps } from "./battle-map.types";
import css from "./battle-map.module.css";
import { isValidCoordinate, parseStringCoordinateX } from "~/utils/coordinates";
import clsx from "clsx";

export const Tile = ({
  locationX,
  locationY,
  isCovered,
  isAttacked,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: ITileProps) => {
  const coordinateX = parseStringCoordinateX(locationX);
  const isValidCoor = isValidCoordinate(coordinateX, locationY);
  const id = isValidCoor ? `${locationY}${coordinateX}` : undefined;

  let text = null;
  if (locationX === 0 && locationY > 0 && locationY < 11) {
    text = locationY.toString();
  } else if (locationY === 0 && locationX > 0 && locationX < 11) {
    text = coordinateX;
  }

  const { shipPart = "", orientation = "" } = isCovered || {};
  const combinedClasses = clsx(
    css["BattleMap-tile"],
    isCovered && [css["is-covered"], css[shipPart], css[orientation]],
    isAttacked && css["is-attacked"]
  );

  return (
    <div
      id={id}
      className={combinedClasses}
      data-location-x={isValidCoor ? coordinateX : undefined}
      data-location-y={isValidCoor ? locationY : undefined}
      onMouseEnter={isValidCoor ? onMouseEnter : undefined}
      onMouseLeave={isValidCoor ? onMouseLeave : undefined}
      onContextMenu={onContextMenu}
    >
      {text}
    </div>
  );
};
