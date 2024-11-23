import { Icon } from "../icon";
import { ISightProps } from "./battle-map.types";
import css from "./battle-map.module.css";
import { parseNumberCoordinateX } from "~/utils";
import { useEffect } from "react";
import { DEFAULT_ATTACK_DELAY } from "~/constants";
import clsx from "clsx";

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
      className={clsx(css["Sight"], isShot && isInTurn && css["is-shooting"])}
      style={{ left, top }}
    >
      <Icon size="100%" name="sight" />
    </div>
  );
};
