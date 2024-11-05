import { ICursorShadowShipProps } from "./cursor-shadow-ship.types";
import styles from "./cursor-shadow-ship.module.css";

export const CursorShadowShip = ({
  length,
  orientation = "horizontal",
  locationX,
  locationY,
}: ICursorShadowShipProps) => {
  if (!length) return;

  const tiles = [];
  for (let index = 0; index < length; index++) {
    tiles.push(<div key={index}></div>);
  }

  const orientationCSS =
    orientation === "vertical" ? styles["vertical"] : styles["horizontal"];

  return (
    <div
      className={`${styles["CursorShadowShip"]} ${orientationCSS}`}
      style={{
        left: `${locationX - 4}px`,
        top: `${locationY - 4}px`,
      }}
    >
      {tiles}
    </div>
  );
};
