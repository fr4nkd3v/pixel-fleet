import css from "./fleet-menu.module.css";
import { type IFleetMenuProps } from "./fleet-menu.types";
import { FleetMenuItem } from "./fleet-menu-item";
import { useOpponentStore, usePlayerStore, useShipDeployStore } from "~/stores";
import { TShipId } from "~/types";

export const FleetMenu = ({ variant, setCursorLocation }: IFleetMenuProps) => {
  const { fleet: playerFleet } = usePlayerStore();
  const { fleet: opponentFleet } = useOpponentStore();
  const { shipId: shipOnDeployId, setShipOnDeploy } = useShipDeployStore();

  const isPlayer = variant === "player";

  const title = isPlayer ? "Mi flota" : "Flota enemiga";
  const shipList = isPlayer ? playerFleet : opponentFleet;
  const isHidden = !isPlayer;

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
    <div className={css["FleetMenu"]}>
      <div className={css["FleetMenu-texts"]}>
        <div className={css["FleetMenu-primaryText"]}>{title}</div>
      </div>
      <div className={css["FleetMenu-ships"]}>
        {shipList.map((ship) => (
          <FleetMenuItem
            key={ship.id}
            shipData={ship}
            isHidden={isHidden}
            shipOnDeployId={shipOnDeployId}
            onDeploying={handleDeployingShip}
          />
        ))}
      </div>
    </div>
  );
};
