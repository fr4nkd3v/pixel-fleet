import type { IFleetMenuOpponentItemProps } from "./fleet-menu.types";
import { Icon } from "~/components/shared/icon";
import css from "./fleet-menu.module.css";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { SHIP_TYPES } from "~/constants";

export const FleetMenuOpponentItem = ({ shipData }: IFleetMenuOpponentItemProps) => {
  const { t } = useTranslation();
  const { id: shipId, health: currentHealth, isDeployed } = shipData;

  const fullHealth = SHIP_TYPES[shipId].length;
  const isDead = currentHealth === 0;
  const lives = Array.from({ length: fullHealth }, (_, index) => {
    return <div className={clsx(css["FleetMenuItem-live"], css["is-dead"])} key={index}></div>;
  });

  const combinedClasses = clsx(
    css["FleetMenuItem"],
    isDeployed && css["is-deployed"],
    !isDeployed && css["not-deployed"],
  );

  return (
    <div className={css["FleetMenuItem-wrapper"]}>
      <div className={css["FleetMenuItem-back"]}></div>
      <div className={combinedClasses}>
        <div className={css["FleetMenuItem-icon"]}>
          <Icon size="100%" name="ship" />
        </div>
        <div className={css["FleetMenuItem-name"]}>{t("game:unidentified")}</div>
        <div className={css["FleetMenuItem-health"]}>{isDead ? lives : "???"}</div>
      </div>
    </div>
  );
};
