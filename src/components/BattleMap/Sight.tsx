import { SightIcon } from "../Icon"
import { ISightProps } from "./BattleMap.types"
import styles from './BattleMap.module.css';
import { parseNumberCoordinateX } from "~/utils";
import { useEffect, useState } from "react";

export const Sight = (
  { targetCoordinates, isShot, onFinishesShot, isInTurn }: ISightProps
) => {
  const [isShooting, setIsShooting] = useState(false);
  const { x: strX, y } = targetCoordinates;
  const x = parseNumberCoordinateX(strX);

  const left = `calc(var(--tile-size) * ${x})`;
  const top = `calc(var(--tile-size) * ${y})`;

  useEffect(() => {
    if (!(isShot && isInTurn && !isShooting)) return;
    setIsShooting(true);
    console.log('Objetivo localizado, disparando...');

    setTimeout(() => {
      console.log('Blanco atacado');
      setIsShooting(false);
      onFinishesShot();
    }, 3000)

  }, [isInTurn, isShooting, isShot, onFinishesShot])

  return (
    <div
      className={`${styles["Sight"]} ${isShot && isInTurn ? styles["is-shooting"] : ''}`}
      style={{left, top}}
    >
      <SightIcon size="100%" />
    </div>
  )
}
