import type { IFleetMenuItemProps } from "./fleet-menu.types";
import { SHIP_TYPES } from "~/constants/game";
import { Icon } from "~/components/icon";
import css from "./fleet-menu.module.css";
import clsx from "clsx";

export const FleetMenuItem = ({
  shipData,
  isHidden = false,
  shipOnDeployId,
  onDeploying,
}: IFleetMenuItemProps) => {
  const { id: shipId, health: currentHealth, isDeployed } = shipData;
  const fullHealth = SHIP_TYPES[shipId].length;

  const lives = Array.from({ length: fullHealth }, (_, index) => {
    const cssIsDead =
      (isHidden && currentHealth === 0) || (!isHidden && index >= currentHealth)
        ? css["is-dead"]
        : null;
    const combinedClasses = clsx(css["FleetMenuItem-live"], cssIsDead);
    return <div className={combinedClasses} key={index}></div>;
  });

  const handleClickItem = (event: React.MouseEvent<HTMLElement>) => {
    if (isDeployed) return;
    const { clientX, clientY } = event;
    onDeploying(shipId, { locationX: clientX, locationY: clientY });
  };

  const combinedClasses = clsx(
    css["FleetMenuItem"],
    !isDeployed && css["not-deployed"],
    shipOnDeployId === shipId && css["selected"]
  );

  return (
    <div className={combinedClasses} onClick={handleClickItem}>
      <div className={css["FleetMenuItem-icon"]}>
        <Icon size="100%" name="ship" />
      </div>
      <div className={css["FleetMenuItem-name"]}>{SHIP_TYPES[shipId].name}</div>
      <div className={css["FleetMenuItem-health"]}>{lives}</div>
    </div>
  );
};
