import { SightIcon } from "../Icon"
import { ISightProps } from "./BattleMap.types"
import styles from './BattleMap.module.css';
import { parseNumberCoordinateX } from "~/utils";

export const Sight = ({ targetCoordinates }: ISightProps) => {
  const { x: strX, y } = targetCoordinates;
  const x = parseNumberCoordinateX(strX);

  const left = `calc(var(--tile-size) * ${x})`;
  const top = `calc(var(--tile-size) * ${y})`;

  return (
    <div
      className={styles["Sight"]}
      style={{left, top}}
    >
      <SightIcon size="100%" />
    </div>
  )
}
