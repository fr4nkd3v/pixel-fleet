import { type ITileProps } from './BattleMap.types';
import styles from './BattleMap.module.css';
import { isValidCoordinate, parseStringCoordinateX } from '~/utils/coordinates';

export const Tile = (
  {
    locationX,
    locationY,
    isCovered,
    isAttacked,
    onMouseEnter,
    onMouseLeave,
    onContextMenu,
  }: ITileProps
) => {
  const coordinateX = parseStringCoordinateX(locationX);
  const isValidCoor = isValidCoordinate(coordinateX, locationY);
  const id = isValidCoor ? `${locationY}${coordinateX}` : undefined

  let text = null;
  if (locationX === 0 && (locationY > 0 && locationY < 11)) {
    text = locationY.toString();
  } else if (locationY === 0 && (locationX > 0 && locationX < 11)) {
    text = coordinateX
  }

  const { shipPart = '', orientation = '' } = isCovered || {};
  const coveredCSSClasses = isCovered
    ? [styles['is-covered'], styles[shipPart], styles[orientation]].join(' ')
    : '';

  const attackedCSSClass = isAttacked ? styles['is-attacked'] : '';

  return (
    <div
      id={id}
      className={`${styles['BattleMap-tile']} ${coveredCSSClasses} ${attackedCSSClass}`}
      data-location-x={isValidCoor ? coordinateX : undefined}
      data-location-y={isValidCoor ? locationY : undefined}
      onMouseEnter={isValidCoor ? onMouseEnter : undefined}
      onMouseLeave={isValidCoor ? onMouseLeave : undefined}
      onContextMenu={onContextMenu}
    >
      {text}
    </div>
  )
}