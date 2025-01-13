import type { IFleetMenuItemProps } from "./fleet-menu.types";
import { SHIP_TYPES } from "~/constants/game";
import { Icon } from "~/components/shared/icon";
import css from "./fleet-menu.module.css";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export const FleetMenuItem = ({
  shipData,
  perspective,
  shipOnDeployId,
  onDeploying,
}: IFleetMenuItemProps) => {
  const { t } = useTranslation();
  const isPlayer = perspective === "player";

  const { id: shipId, health: currentHealth, isDeployed } = shipData;
  const fullHealth = SHIP_TYPES[shipId].length;

  const lives = Array.from({ length: fullHealth }, (_, index) => {
    const cssIsDead =
      (!isPlayer && currentHealth === 0) || (isPlayer && index >= currentHealth)
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

  let combinedClasses = "";
  if (isPlayer) {
    combinedClasses = clsx(
      css["FleetMenuItem"],
      isDeployed && shipOnDeployId !== shipId && css["is-deployed"],
      !isDeployed && shipOnDeployId !== shipId && css["not-deployed"],
      shipOnDeployId === shipId && css["is-deploying"]
    );
  } else {
    combinedClasses = clsx(
      css["FleetMenuItem"],
      isDeployed && css["is-deployed"],
      !isDeployed && css["not-deployed"]
    );
  }

  return (
    <div className={css["FleetMenuItem-wrapper"]}>
      <div className={css["FleetMenuItem-back"]}></div>
      <div className={combinedClasses} onClick={handleClickItem}>
        <div className={css["FleetMenuItem-icon"]}>
          <Icon size="100%" name="ship" />
        </div>
        <div className={css["FleetMenuItem-name"]}>
          {isPlayer ? SHIP_TYPES[shipId].name : t("game:unidentified")}
        </div>
        <div className={css["FleetMenuItem-health"]}>
          {isPlayer ? lives : "???"}
        </div>
      </div>
    </div>
  );
};
