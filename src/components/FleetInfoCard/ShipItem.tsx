import type { IShipItemProps } from './ShipItem.types';
import { SHIP_TYPES } from '~/constants/game';
import { ShipIcon } from '~/components/Icon';
import styles from './ShipItem.module.css';

export const ShipItem = (
  {
    shipId,
    shipType,
    fullHealth,
    currentHealth,
    isDeployed,
    onDeploying,
    currentShipOnDeploy
  }: IShipItemProps
) => {
  const lifes = [];
  for (let i = 1; i <= fullHealth; i++) {
    const extraCssClass = i <= currentHealth ? '' : styles['is-dead'];
    lifes.push(
      <div className={`${styles['ShipItem-live']} ${extraCssClass}`} key={i}></div>
    )
  }

  const handleClickShipItem = (event: React.MouseEvent<HTMLElement>) => {
    if (isDeployed) return;
    const {clientX, clientY} = event;
    onDeploying(shipId, {locationX: clientX, locationY: clientY});
  }

  return (
    <div
      className={`${styles['ShipItem']} ${isDeployed ? '' : styles['not-deployed']} ${currentShipOnDeploy?.shipId === shipId ? styles['selected'] : ''}`}
      onClick={handleClickShipItem}
    >
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