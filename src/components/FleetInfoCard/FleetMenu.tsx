import styles from './FleetMenu.module.css';
import { type IFleetMenuProps } from './FleetMenu.types';
import { ShipItem } from "./ShipItem"

export const FleetMenu = ({ shipList, onDeployingShip, currentShipOnDeploy }: IFleetMenuProps) => {
  return (
    <div className={styles['FleetMenu']}>
      <div className={styles['FleetMenu-mainText']}>DESPLIEGA TU FLOTA</div>
      <p className={styles['FleetMenu-complementaryText']}>Selecciona y ubica tus unidades en los cuadros de tu zona de despliegue</p>
      <div className={styles['FleetMenu-ships']}>
        {shipList.map(ship => (
          <ShipItem
            shipId={ship.id}
            shipType={ship.id}
            key={ship.id}
            health={ship.health}
            isDeployed={ship.location !== null}
            onDeploying={onDeployingShip}
            currentShipOnDeploy={currentShipOnDeploy}
          />
        ))}
      </div>
    </div>
  )
}



