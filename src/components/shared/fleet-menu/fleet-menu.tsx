import css from "./fleet-menu.module.css";
import { type IFleetMenuProps } from "./fleet-menu.types";
import { FleetMenuItem } from "./fleet-menu-item";
import { useOpponentStore, usePlayerStore, useShipDeployStore } from "~/stores";
import { TShipId } from "~/types";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export const FleetMenu = ({
  perspective,
  className,
  setCursorLocation,
}: IFleetMenuProps) => {
  const { t } = useTranslation();

  const { fleet: playerFleet } = usePlayerStore();
  const { fleet: opponentFleet } = useOpponentStore();
  const { shipId: shipOnDeployId, setShipOnDeploy } = useShipDeployStore();

  const isPlayer = perspective === "player";

  const title = t(`game:${isPlayer ? "player" : "opponent"}.fleet_menu_text`);
  const shipList = isPlayer ? playerFleet : opponentFleet;

  const handleDeployingShip = (
    shipId: TShipId,
    { locationX, locationY }: { locationX: number; locationY: number }
  ) => {
    setShipOnDeploy(shipId);
    if (setCursorLocation)
      setCursorLocation({
        left: locationX,
        top: locationY,
      });
  };

  return (
    <div
      className={clsx(
        css["FleetMenu"],
        css[isPlayer ? "is-player" : "is-opponent"],
        className
      )}
    >
      <div className={css["FleetMenu-texts"]}>
        <div className={css["FleetMenu-primaryText"]}>{title}</div>
      </div>
      <div className={css["FleetMenu-ships"]}>
        {shipList.map((ship) => (
          <FleetMenuItem
            key={ship.id}
            shipData={ship}
            perspective={perspective}
            shipOnDeployId={shipOnDeployId}
            onDeploying={handleDeployingShip}
          />
        ))}
      </div>
    </div>
  );
};
