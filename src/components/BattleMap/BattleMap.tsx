import { type IBattleMapProps } from './BattleMap.types';
import { Tile } from './Tile';
import styles from './BattleMap.module.css';

const isCoordinatePair = (value: string) => {
  return Number(value) || value.length === 1;
}

export const BattleMap = ({ width, height }: IBattleMapProps) => {
  const tiles = [];
  let id;
  // debugger;
  for (let h = 0; h <= height; h++) {
    for (let w = 0; w <= width; w++) {
      if (h === 0) {
        if (w === 0) { // First tile without interaction or coordinate label
          id = 'start';
        } else { // Top Coordinate labels
          id = String.fromCharCode(w + 96);
        }
      } else {
        if (w === 0) { // Left Coordinate labels
          id = h.toString();
        } else { // Tiles with interaction
          id = `${h}${String.fromCharCode(w + 96)}`;
        }
      }

      tiles.push(
        <Tile
          id={id}
          key={id}
          text={isCoordinatePair(id) ? id : undefined}
        />
      );
    }
  }

  return (
    <section
      className={styles['BattleMap']}
      style={{
        'gridTemplateColumns': `repeat(${width + 1}, var(--size-48))`,
        'gridTemplateRows': `repeat(${height + 1}, var(--size-48))`,
      }}
    >
      {tiles}
    </section>
  )
}