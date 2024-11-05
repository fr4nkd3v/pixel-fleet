import { SHIP_TYPES } from "~/constants/game";
import styles from "./fleet-menu.module.css";
import { type IFleetMenuProps } from "./fleet-menu.types";
import { ShipItem } from "./ship-item";

export const FleetMenu = ({
  shipList,
  primaryText,
  secondaryText,
  onDeployingShip,
  shipOnDeployId,
}: IFleetMenuProps) => {
  return (
    <div className={styles["FleetMenu"]}>
      <div className={styles["FleetMenu-texts"]}>
        <div className={styles["FleetMenu-primaryText"]}>{primaryText}</div>
        <p className={styles["FleetMenu-secondaryText"]}>{secondaryText}</p>
      </div>
      <div className={styles["FleetMenu-ships"]}>
        {shipList.map((ship) => (
          <ShipItem
            shipId={ship.id}
            shipType={ship.id}
            key={ship.id}
            fullHealth={SHIP_TYPES[ship.id].length}
            currentHealth={ship.health}
            isDeployed={ship.isDeployed}
            shipOnDeployId={shipOnDeployId}
            onDeploying={onDeployingShip}
          />
        ))}
      </div>
    </div>
  );
};
