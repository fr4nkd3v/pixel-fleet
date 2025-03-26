import type { IFleetMenuPlayerItemProps } from "./fleet-menu.types";
import { SHIP_TYPES } from "~/constants/game";
import { Icon } from "~/components/shared/icon";
import css from "./fleet-menu.module.css";
import clsx from "clsx";
import { useDrag } from "@use-gesture/react";
import { useShipDeployment } from "~/hooks";

export const FleetMenuPlayerItem = ({
  shipData,
  shipOnDeployId,
  setCursorLocation,
}: IFleetMenuPlayerItemProps) => {
  const { handleDragStart, handleDragMove, handleDragEnd, handleDragCancel } = useShipDeployment();

  const { id: shipId, health: currentHealth, isDeployed } = shipData;
  const fullHealth = SHIP_TYPES[shipId].length;

  const lives = Array.from({ length: fullHealth }, (_, index) => {
    const cssIsDead = index >= currentHealth && css["is-dead"];
    const combinedClasses = clsx(css["FleetMenuItem-live"], cssIsDead);
    return <div className={combinedClasses} key={index}></div>;
  });

  const combinedClasses = clsx(
    css["FleetMenuItem"],
    isDeployed && shipOnDeployId !== shipId && css["is-deployed"],
    !isDeployed && shipOnDeployId !== shipId && css["not-deployed"],
    shipOnDeployId === shipId && css["is-deploying"],
  );

  const bind = useDrag((state) => {
    const {
      xy: [x, y],
      type,
    } = state;

    if (isDeployed) return;

    const target = document.elementFromPoint(x, y);
    if (!target) return;

    if (type === "pointerdown") {
      handleDragStart(shipId, [x, y], setCursorLocation);
    } else if (type === "pointermove") {
      handleDragMove(target as HTMLElement, [x, y], setCursorLocation);
    } else if (type === "pointerup") {
      handleDragEnd(target as HTMLElement);
    } else {
      handleDragCancel();
    }

    return false; // Prevent default drag behavior
  });

  return (
    <div className={css["FleetMenuItem-wrapper"]} {...bind()}>
      <div className={css["FleetMenuItem-back"]}></div>
      <div className={combinedClasses}>
        <div className={css["FleetMenuItem-icon"]}>
          <Icon size="100%" name="ship" />
        </div>
        <div className={css["FleetMenuItem-name"]}>{SHIP_TYPES[shipId].name}</div>
        <div className={css["FleetMenuItem-health"]}>{lives}</div>
      </div>
    </div>
  );
};
