import { type ITileProps } from './BattleMap.types';
import styles from './BattleMap.module.css';
import { isValidCoordinate, parseCoordinateX } from '~/utils/utils';

export const Tile = (
  { locationX, locationY, isCovered, onMouseEnter, onMouseLeave, onContextMenu }: ITileProps
) => {
  const coordinateX = parseCoordinateX(locationX);
  const id = isValidCoordinate(coordinateX, locationY) ? `${locationY}${coordinateX}` : undefined

  let text = null;
  if (locationX === 0 && (locationY > 0 && locationY < 11)) {
    text = locationY.toString();
  } else if (locationY === 0 && (locationX > 0 && locationX < 11)) {
    text = coordinateX
  }

  return (
    <div
      id={id}
      className={`${styles['BattleMap-tile']} ${isCovered && styles['is-covered']}`}
      data-location-x={isValidCoordinate(coordinateX, locationY) ? coordinateX : undefined}
      data-location-y={isValidCoordinate(coordinateX, locationY) ? locationY : undefined}
      onMouseEnter={isValidCoordinate(coordinateX, locationY) ? onMouseEnter : undefined}
      onMouseLeave={isValidCoordinate(coordinateX, locationY) ? onMouseLeave : undefined}
      onContextMenu={onContextMenu}
    >
      {text}
    </div>
  )
}