import { SHIP_TYPES } from "~/constants/game";
import css from "./fleet-menu.module.css";
import { type IFleetMenuProps } from "./fleet-menu.types";
import { FleetMenuItem } from "./fleet-menu-item";

export const FleetMenu = ({
  shipList,
  primaryText,
  secondaryText,
  onDeployingShip,
  shipOnDeployId,
}: IFleetMenuProps) => {
  return (
    <div className={css["FleetMenu"]}>
      <div className={css["FleetMenu-texts"]}>
        <div className={css["FleetMenu-primaryText"]}>{primaryText}</div>
        <p className={css["FleetMenu-secondaryText"]}>{secondaryText}</p>
      </div>
      <div className={css["FleetMenu-ships"]}>
        {shipList.map((ship) => (
          <FleetMenuItem
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
