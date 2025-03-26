import css from "./fleet-menu.module.css";
import { type IFleetMenuPlayerProps } from "./fleet-menu.types";
import { FleetMenuPlayerItem } from "./fleet-menu-player-item";
import { usePlayerStore, useShipDeployStore } from "~/stores";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export const FleetMenuPlayer = ({ className, setCursorLocation }: IFleetMenuPlayerProps) => {
  const { t } = useTranslation();
  const { fleet: playerFleet } = usePlayerStore();
  const { shipId: shipOnDeployId } = useShipDeployStore();

  const title = t(`game:player.fleet_menu_text`);

  return (
    <div className={clsx(css["FleetMenu"], css["is-player"], className)}>
      <div className={css["FleetMenu-texts"]}>
        <div className={css["FleetMenu-primaryText"]}>{title}</div>
      </div>
      <div className={css["FleetMenu-ships"]}>
        {playerFleet.map((ship) => (
          <FleetMenuPlayerItem
            key={ship.id}
            shipData={ship}
            shipOnDeployId={shipOnDeployId}
            setCursorLocation={setCursorLocation}
          />
        ))}
      </div>
    </div>
  );
};
