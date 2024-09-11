import styles from './FleetMenu.module.css';
import { type IFleetMenuProps } from './FleetMenu.types';
import { ShipItem } from "./ShipItem"

export const FleetMenu = ({ shipList }: IFleetMenuProps) => {
  return (
    <div className={styles['FleetMenu']}>
      <div className={styles['FleetMenu-mainText']}>DESPLIEGA TU FLOTA</div>
      <p className={styles['FleetMenu-complementaryText']}>Selecciona y ubica tus unidades en los cuadros de tu zona de despliegue</p>
      <div className={styles['FleetMenu-ships']}>
        {shipList.map(ship => (
          <ShipItem shipType={ship} key={ship} />
        ))}
      </div>
    </div>
  )
}



