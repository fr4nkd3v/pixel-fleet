import css from "./fleet-menu.module.css";
import { IFleetMenuOpponentProps } from "./fleet-menu.types";
import { FleetMenuOpponentItem } from "./fleet-menu-opponent-item";
import { useOpponentStore } from "~/stores";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export const FleetMenuOpponent = ({ className }: IFleetMenuOpponentProps) => {
  const { t } = useTranslation();
  const { fleet: opponentFleet } = useOpponentStore();

  const title = t(`game:opponent.fleet_menu_text`);

  return (
    <div className={clsx(css["FleetMenu"], css["is-opponent"], className)}>
      <div className={css["FleetMenu-texts"]}>
        <div className={css["FleetMenu-primaryText"]}>{title}</div>
      </div>
      <div className={css["FleetMenu-ships"]}>
        {opponentFleet.map((ship) => (
          <FleetMenuOpponentItem key={ship.id} shipData={ship} />
        ))}
      </div>
    </div>
  );
};
