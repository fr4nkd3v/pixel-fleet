import type { IShipItemProps } from './ShipItem.types';
import { SHIP_TYPES } from '../../constants/game';
import { ShipIcon } from '../Icon';
import styles from './ShipItem.module.css';

export const ShipItem = ({ shipType }: IShipItemProps) => {
  const lifes = [];
  for (let i = 0; i < SHIP_TYPES[shipType].length; i++) {
    lifes.push(
      <div className={styles['ShipItem-life']} key={i}></div>
    )
  }

  return (
    <div className={styles['ShipItem']}>
      <div className={styles['ShipItem-icon']}>
        <ShipIcon size='100%' />
      </div>
      <div className={styles['ShipItem-name']}>
        {SHIP_TYPES[shipType].name}
      </div>
      <div className={styles['ShipItem-health']}>
        {lifes}
      </div>
    </div>
  )
}