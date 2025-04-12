import { useEffect, useState } from "react";
import { Icon } from "~/components/shared/icon";
import { ISightProps } from "./battle-map.types";
import css from "./battle-map.module.css";
import { delay } from "~/utils";
import { DEFAULT_ATTACK_DELAY } from "~/constants";
import sprites from "~/assets/sprites-effect.png";
import clsx from "clsx";

export const Sight = ({ targetCoordinates, isShooting, onFinishesShot, isInTurn }: ISightProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  const { x: strX, y: rawY } = targetCoordinates;
  const x = strX ?? 0;
  const y = rawY ?? 0;

  const sightStyles = {
    left: `calc(var(--tile-size) * ${x})`,
    top: `calc((var(--tile-size) + 1px) * ${y})`,
  };

  const animationSize = 64;
  const animationStyles = {
    left: `calc(var(--tile-size) * ${x} + (var(--tile-size) - ${animationSize}px) / 2)`,
    top: `calc(var(--tile-size) * ${y} + (var(--tile-size) - ${animationSize}px) / 2)`,
    backgroundImage: `url(${sprites})`,
  };

  useEffect(() => {
    if (!isShooting || isInTurn) return;

    (async () => {
      await delay(DEFAULT_ATTACK_DELAY);
      setShowAnimation(true);

      await delay(800);
      setShowAnimation(false);
      onFinishesShot();
    })();
  }, [isInTurn, isShooting, onFinishesShot]);

  return (
    <>
      {!showAnimation && (
        <div
          className={clsx(css["Sight"], isShooting && !isInTurn && css["is-shooting"])}
          style={sightStyles}
        >
          <Icon size="100%" name="sight" />
        </div>
      )}
      {showAnimation ? <i className={css["AttackAnimation"]} style={animationStyles}></i> : null}
    </>
  );
};
