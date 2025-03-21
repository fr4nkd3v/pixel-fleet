import type { IFleetMenuItemProps } from "./fleet-menu.types";
import { SHIP_TYPES } from "~/constants/game";
import { Icon } from "~/components/shared/icon";
import css from "./fleet-menu.module.css";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useDrag } from "@use-gesture/react";
import { useShipDeployment } from "~/hooks";

export const FleetMenuItem = ({
  shipData,
  perspective,
  shipOnDeployId,
  setCursorLocation,
}: IFleetMenuItemProps) => {
  const { t } = useTranslation();
  const { handleDragStart, handleDragMove, handleDragEnd } = useShipDeployment();

  const isPlayer = perspective === "player";

  const { id: shipId, health: currentHealth, isDeployed } = shipData;
  const fullHealth = SHIP_TYPES[shipId].length;

  const lives = Array.from({ length: fullHealth }, (_, index) => {
    const cssIsDead =
      ((!isPlayer && currentHealth === 0) || (isPlayer && index >= currentHealth)) && css["is-dead"];
    const combinedClasses = clsx(css["FleetMenuItem-live"], cssIsDead);
    return <div className={combinedClasses} key={index}></div>;
  });

  const combinedClasses = isPlayer
    ? clsx(
        css["FleetMenuItem"],
        isDeployed && shipOnDeployId !== shipId && css["is-deployed"],
        !isDeployed && shipOnDeployId !== shipId && css["not-deployed"],
        shipOnDeployId === shipId && css["is-deploying"],
      )
    : clsx(css["FleetMenuItem"], isDeployed && css["is-deployed"], !isDeployed && css["not-deployed"]);

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
    } else if (type === "pointercancel") {
      // Handle drag cancellation
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
        <div className={css["FleetMenuItem-name"]}>
          {isPlayer ? SHIP_TYPES[shipId].name : t("game:unidentified")}
        </div>
        <div className={css["FleetMenuItem-health"]}>{isPlayer ? lives : "???"}</div>
      </div>
    </div>
  );
};
