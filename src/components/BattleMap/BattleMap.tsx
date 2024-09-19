import { type IBattleMapProps } from './BattleMap.types';
import { Tile } from './Tile';
import styles from './BattleMap.module.css';
import { getNextCoordinates, getTilesByCoordinates, hasCoordinateCovered, parseCoordinateX } from '~/utils/utils';
import { SHIP_TYPES } from '~/constants/game';
import { useRef } from 'react';
import { TOrientationType } from '~/types/game';

export const BattleMap = (
  {
    width,
    height,
    mapCoordinates,
    currentShipOnDeploy,
    onDeployedShip,
    onChangeOrientation,
    onChangeCursorLocation
  }: IBattleMapProps
) => {
  const battleMapRef = useRef<null | HTMLElement>(null);

  const handleMouseEnterAndLeaveTile = (
    event: React.MouseEvent, action: 'enter' | 'leave', forcedOrientation?: TOrientationType
  ) => {
    if (!currentShipOnDeploy) return;

    const { locationX, locationY } = (event.target as HTMLElement).dataset;
    if (!locationX || !locationY) return;

    const length: number = SHIP_TYPES[currentShipOnDeploy.shipId].length;
    const coordinates = getNextCoordinates(locationX, Number(locationY), length, forcedOrientation || currentShipOnDeploy.orientation);
    // Validations
    const isOutOfArea = coordinates.length < length;
    const isCovered = hasCoordinateCovered(coordinates, mapCoordinates);

    const tiles = getTilesByCoordinates(coordinates);

    if (action === 'enter') {
      tiles.forEach(tile => tile.classList.add(
        styles[(isOutOfArea || isCovered) ? 'is-unavailable' : 'is-available']
      ))
    } else if (action === 'leave') {
      tiles.forEach(tile => tile.classList.remove(
        styles['is-available'], styles['is-unavailable']
      ))
    }
  }

  const handleContextMenuTile = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!currentShipOnDeploy) return;
    const oppositeOrientation = currentShipOnDeploy.orientation === 'horizontal'
      ? 'vertical'
      : 'horizontal'
    onChangeOrientation(oppositeOrientation);

    if (!battleMapRef.current) return;
    const tiles = battleMapRef.current.querySelectorAll(
      `.${styles['BattleMap-tile']}.${styles['is-available']}, .${styles['BattleMap-tile']}.${styles['is-unavailable']}`
    );
    tiles.forEach(tile => tile.classList.remove(
      styles['is-available'], styles['is-unavailable']
    ));
    handleMouseEnterAndLeaveTile(event, 'enter', oppositeOrientation)
  }

  const tiles = [];
  for (let h = 0; h <= height; h++) {
    for (let w = 0; w <= width; w++) {
      const isCovered = mapCoordinates.some(({ x, y, covered }) => x === parseCoordinateX(w) && y === h && covered)
      tiles.push(
        <Tile
          key={`${h}${w}`}
          locationX={w}
          locationY={h}
          isCovered={isCovered}
          onMouseEnter={(event) => handleMouseEnterAndLeaveTile(event, 'enter')}
          onMouseLeave={(event) => handleMouseEnterAndLeaveTile(event, 'leave')}
          onContextMenu={handleContextMenuTile}
        />
      );
    }
  }

  const handleClickBattleMap = (event: React.MouseEvent) => {
    // Validate data & elements
    if (!currentShipOnDeploy) return;

    const childTile = (event.target as Element).closest(`.${styles['BattleMap-tile']}`);
    if (!childTile) return;

    const { locationX, locationY } = (childTile as HTMLElement).dataset;
    if (!locationX || !locationY) return;

    // Get coordinates that form the ship deployed
    const length: number = SHIP_TYPES[currentShipOnDeploy.shipId].length;
    const coordinates = getNextCoordinates(locationX, Number(locationY), length, currentShipOnDeploy.orientation);
    if (coordinates.length < length) return; // ❌ Is unavailable | out-of-area location

    const isCovered = hasCoordinateCovered(coordinates, mapCoordinates);
    if (isCovered) return; // ❌ Is unavailable | location covered by another ship

    // ✅ Is available
    onDeployedShip(currentShipOnDeploy.shipId, locationX, locationY);
    const tiles = getTilesByCoordinates(coordinates);
    tiles.forEach(tile => tile.classList.remove(
      styles['is-available'], styles['is-unavailable']
    ))
  }

  const handleMouseMoveBattleMap = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    onChangeCursorLocation({ x: clientX, y: clientY });
  }

  return (
    <section
      className={styles['BattleMap']}
      style={{
        'gridTemplateColumns': `repeat(${width + 1}, var(--tile-size))`,
        'gridTemplateRows': `repeat(${height + 1}, var(--tile-size))`,
      }}
      onClick={handleClickBattleMap}
      // onContextMenu={handleContextMenuBattleMap}
      onMouseMove={handleMouseMoveBattleMap}
      ref={battleMapRef}
    >
      {tiles}
      <div
        className={styles['BattleMap-background']}
        style={{
          width: `calc(var(--tile-size) * ${width})`,
          height: `calc(var(--tile-size) * ${height})`,
        }}
      ></div>
    </section>
  )
}