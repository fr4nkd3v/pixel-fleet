import { type ITileProps } from './BattleMap.types';
import styles from './BattleMap.module.css';

export const Tile = ({ id, text }: ITileProps) => {
  return (
    <div id={id} className={styles['BattleMap-tile']}>
      {text && text}
    </div>
  )
}