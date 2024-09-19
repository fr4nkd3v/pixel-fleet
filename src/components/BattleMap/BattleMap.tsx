import { type IBattleMapProps } from './BattleMap.types';
import { Tile } from './Tile';
import styles from './BattleMap.module.css';
import { getNextTiles, parseCoordinateX } from '~/utils/utils';
import { SHIP_TYPES } from '~/constants/game';
import { useRef } from 'react';
import { TOrientationType } from '~/pages/GamePage/GamePage.types';

export const BattleMap = (
  {
    width,
    height,
    mapCoordinates,
    currentShipDeploying,
    onDeployedShip,
    onChangeOrientation,
    onChangeCursorLocation
  }: IBattleMapProps
) => {
  const battleMapRef = useRef<null | HTMLElement>(null);

  const handleMouseEnterAndLeaveTile = (
    event: React.MouseEvent, action: 'enter' | 'leave', forcedOrientation?: TOrientationType
  ) => {
    if (!currentShipDeploying) return;

    const childTile = (event.target as Element);
    if (!childTile) return;

    const { locationX, locationY } = (childTile as HTMLElement).dataset;
    if (!locationX || !locationY) return;

    const length: number = SHIP_TYPES[currentShipDeploying.shipId].length;
    const tiles = getNextTiles(locationX, Number(locationY), length, forcedOrientation || currentShipDeploying.orientation);

    if (action === 'enter') {
      tiles.forEach(tile => tile.classList.add(
        styles[tiles.length < length ? 'is-unavailable' : 'is-available']
      ))
    } else if (action === 'leave') {
      tiles.forEach(tile => tile.classList.remove(
        styles['is-available'], styles['is-unavailable']
      ))
    }
  }

  const handleContextMenuTile = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!currentShipDeploying) return;
    const oppositeOrientation = currentShipDeploying.orientation === 'horizontal'
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
    if (!currentShipDeploying) return;

    const childTile = (event.target as Element).closest(`.${styles['BattleMap-tile']}`);
    if (!childTile) return;

    const { locationX, locationY } = (childTile as HTMLElement).dataset;
    if (!locationX || !locationY) return;

    const length: number = SHIP_TYPES[currentShipDeploying.shipId].length;
    const tiles = getNextTiles(locationX, Number(locationY), length, currentShipDeploying.orientation);

    if (tiles.length < length) return; // ❌ Is unavailable

    // ✅ Is available
    onDeployedShip(currentShipDeploying.shipId, locationX, locationY);

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