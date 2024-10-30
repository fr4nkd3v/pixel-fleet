import { SHIP_TYPES } from "~/constants/game";
import styles from "./FleetMenu.module.css";
import { type IFleetMenuProps } from "./FleetMenu.types";
import { ShipItem } from "./ShipItem";

export const FleetMenu = ({
  shipList,
  primaryText,
  secondaryText,
  onDeployingShip,
  shipOnDeployId,
}: IFleetMenuProps) => {
  return (
    <div className={styles["FleetMenu"]}>
      <div className={styles["FleetMenu-primaryText"]}>{primaryText}</div>
      <p className={styles["FleetMenu-secondaryText"]}>{secondaryText}</p>
      <div className={styles["FleetMenu-ships"]}>
        {shipList.map((ship) => (
          <ShipItem
            shipId={ship.id}
            shipType={ship.id}
            key={ship.id}
            fullHealth={SHIP_TYPES[ship.id].length}
            currentHealth={ship.health}
            isDeployed={ship.isDeployed}
            onDeploying={onDeployingShip}
            shipOnDeployId={shipOnDeployId}
          />
        ))}
      </div>
    </div>
  );
};
