import { SightIcon } from "../Icon";
import { ISightProps } from "./BattleMap.types";
import styles from "./BattleMap.module.css";
import { parseNumberCoordinateX } from "~/utils";
import { useEffect } from "react";
import { DEFAULT_ATTACK_DELAY } from "~/constants";

export const Sight = ({
  targetCoordinates,
  isShooting: isShot,
  onFinishesShot,
  isInTurn,
}: ISightProps) => {
  const { x: strX, y = 0 } = targetCoordinates;
  const x = parseNumberCoordinateX(strX);

  const left = `calc(var(--tile-size) * ${x})`;
  const top = `calc(var(--tile-size) * ${y})`;

  useEffect(() => {
    if (!isShot || !isInTurn) return;

    setTimeout(() => onFinishesShot(), DEFAULT_ATTACK_DELAY);
  }, [isInTurn, isShot, onFinishesShot]);

  return (
    <div
      className={`${styles["Sight"]} ${
        isShot && isInTurn ? styles["is-shooting"] : ""
      }`}
      style={{ left, top }}
    >
      <SightIcon size="100%" />
    </div>
  );
};
