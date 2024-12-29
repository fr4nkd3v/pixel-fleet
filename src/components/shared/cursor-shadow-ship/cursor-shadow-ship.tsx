import { ICursorShadowShipProps } from "./cursor-shadow-ship.types";
import css from "./cursor-shadow-ship.module.css";
import clsx from "clsx";
import { useShipDeployStore } from "~/stores";
import { SHIP_TYPES } from "~/constants";

export const CursorShadowShip = ({
  locationX,
  locationY,
}: ICursorShadowShipProps) => {
  const { shipId, orientation } = useShipDeployStore();
  if (!shipId) return;

  const length = SHIP_TYPES[shipId].length;

  const tiles = Array.from({ length }, (_, index) => <div key={index}></div>);

  const combinedClasses = clsx(
    css["CursorShadowShip"],
    orientation === "vertical" ? css["vertical"] : css["horizontal"]
  );

  return (
    <div
      className={combinedClasses}
      style={{
        left: `${locationX - 4}px`,
        top: `${locationY - 4}px`,
      }}
    >
      {tiles}
    </div>
  );
};
