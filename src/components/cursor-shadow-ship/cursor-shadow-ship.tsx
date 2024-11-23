import { ICursorShadowShipProps } from "./cursor-shadow-ship.types";
import css from "./cursor-shadow-ship.module.css";
import clsx from "clsx";

export const CursorShadowShip = ({
  length,
  orientation = "horizontal",
  locationX,
  locationY,
}: ICursorShadowShipProps) => {
  if (!length) return;

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
