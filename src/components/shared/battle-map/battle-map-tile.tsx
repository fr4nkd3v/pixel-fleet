import { type ITileProps } from "./battle-map.types";
import css from "./battle-map.module.css";
import { isValidCoordinate } from "~/utils/coordinates";
import clsx from "clsx";
import { isAxisXTile, isAxisYTile } from "~/utils";
import { TCoordinate } from "~/types";
import { useGameStore } from "~/stores";
import { useDrag } from "@use-gesture/react";
import { useShipDeployment } from "~/hooks";

export const Tile = ({
  coordinateX,
  coordinateY,
  isCovered,
  isAttacked,
  perspective,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
  setCursorLocation,
}: ITileProps) => {
  // const hoveredTile = useRef<HTMLElement | null>(null);
  const { handleReDragStart, handleDragMove, handleDragEnd, handleDragCancel } = useShipDeployment();

  const { gamePhase } = useGameStore();

  const isPlayer = perspective === "player";
  const canChangePosition = Boolean(isPlayer && gamePhase === "prestart" && isCovered);

  const validCoordinate = isValidCoordinate(coordinateX, coordinateY);

  const coordinates: TCoordinate = { x: coordinateX, y: coordinateY };
  const text = isAxisYTile(coordinates)
    ? coordinateY.toString()
    : isAxisXTile(coordinates)
      ? coordinateX
      : null;

  const { shipPart = "", orientation = "", isDefeated, isRedeploy } = isCovered || {};

  const combinedClasses = clsx(
    css["BattleMap-tile"],
    isPlayer ? css["is-player"] : css["is-opponent"],
    isCovered && [css["is-covered"], css[shipPart], css[orientation]],
    isAttacked && css["is-attacked"],
    !isPlayer && !isDefeated && css["is-hidden"],
    isRedeploy && css["is-redeploy"],
  );

  const bind = useDrag((state) => {
    const {
      xy: [x, y],
      type,
    } = state;

    if (!canChangePosition) return;

    const target = document.elementFromPoint(x, y);
    if (!target) return;

    if (type === "pointerdown") {
      handleReDragStart(target as HTMLElement, [x, y], setCursorLocation);
    } else if (type === "pointermove") {
      handleDragMove(target as HTMLElement, [x, y], setCursorLocation);
    } else if (type === "pointerup") {
      handleDragEnd(target as HTMLElement, true);
    } else {
      handleDragCancel();
    }

    return false; // Prevent default drag behavior
  });

  return (
    <div
      className={combinedClasses}
      data-coordinate-x={validCoordinate ? coordinateX : undefined}
      data-coordinate-y={validCoordinate ? coordinateY : undefined}
      onMouseEnter={validCoordinate ? onMouseEnter : undefined}
      onMouseLeave={validCoordinate ? onMouseLeave : undefined}
      onContextMenu={onContextMenu}
      {...bind()}
    >
      <span className={css["BattleMap-tileText"]}>{text}</span>
    </div>
  );
};
