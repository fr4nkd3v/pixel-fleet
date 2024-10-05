import { type IBattleMapProps } from './BattleMap.types';
import { Tile } from './Tile';
import styles from './BattleMap.module.css';
import { getNextCoordinates, getTilesByCoordinates, hasCoordinateCovered, parseStringCoordinateX } from '~/utils/coordinates';
import { SHIP_TYPES } from '~/constants/game';
import { useRef } from 'react';
import { TOrientationType } from '~/types/game';
import { Sight } from './Sight';

export const BattleMap = (
  {
    width,
    height,
    mapCoordinates,
    currentShipOnDeploy,
    disabled = false,
    targetCoordinates,
    isReady,
    showSight,
    isShot,
    isInTurn,
    onDeployedShip,
    onChangeOrientation,
    onChangeCursorLocation,
    onFinishesShot,
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
    const nextCoordinates = getNextCoordinates(locationX, Number(locationY), length, forcedOrientation || currentShipOnDeploy.orientation);
    // Validations
    const isOutOfArea = nextCoordinates.length < length;
    const isCovered = hasCoordinateCovered(nextCoordinates, mapCoordinates);

    const tiles = getTilesByCoordinates(nextCoordinates);

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
      const mapCoorFound = mapCoordinates.find(({ x, y }) => x === parseStringCoordinateX(w) && y === h)
      tiles.push(
        <Tile
          key={`${h}${w}`}
          locationX={w}
          locationY={h}
          isCovered={mapCoorFound ? mapCoorFound.covered : false}
          isAttacked={mapCoorFound ? mapCoorFound.attacked : false}
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
    const nextCoordinates = getNextCoordinates(locationX, Number(locationY), length, currentShipOnDeploy.orientation);
    if (nextCoordinates.length < length) return; // ❌ Is unavailable | out-of-area location

    const isCovered = hasCoordinateCovered(nextCoordinates, mapCoordinates);
    if (isCovered) return; // ❌ Is unavailable | location covered by another ship

    // ✅ Is available
    onDeployedShip(currentShipOnDeploy.shipId, locationX, Number(locationY), currentShipOnDeploy.orientation);
    const tiles = getTilesByCoordinates(nextCoordinates);
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
      className={`${styles['BattleMap']} ${disabled ? styles['is-disabled'] : ''}`}
      style={{
        'gridTemplateColumns': `repeat(${width + 1}, var(--tile-size))`,
        'gridTemplateRows': `repeat(${height + 1}, var(--tile-size))`,
      }}
      onClick={handleClickBattleMap}
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
      {isReady && showSight && targetCoordinates && (
        <Sight
          targetCoordinates={targetCoordinates}
          isShot={isShot}
          isInTurn={isInTurn}
          onFinishesShot={onFinishesShot}
        />
      )}
    </section>
  )
}