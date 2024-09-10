import styles from './FleetMenu.module.css';

import { ShipItem } from "./ShipItem"

export const FleetMenu = () => {
  return (
    <div className={styles['FleetMenu']}>
      <div className={styles['FleetMenu-mainText']}>DESPLIEGA TU FLOTA</div>
      <p className={styles['FleetMenu-complementaryText']}>Selecciona y ubica tus unidades en los cuadros de tu zona de despliegue</p>
      <div className={styles['FleetMenu-ships']}>
        <ShipItem shipType="missile_launcher" />
        <ShipItem shipType="battleship" />
        <ShipItem shipType="destroyer" />
        <ShipItem shipType="submarine" />
      </div>
    </div>
  )
}



