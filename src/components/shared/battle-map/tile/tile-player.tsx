import { type ITilePlayerProps } from "./tile.types";
import css from "./tile.module.css";
import clsx from "clsx";
import { isAxisXTile, isAxisYTile, isValidCoordinate } from "~/utils";
import { TCoordinate } from "~/types";
import { useGameStore } from "~/stores";
import { useDrag } from "@use-gesture/react";
import { useShipDeployment } from "~/hooks";

export const TilePlayer = ({
  coordinateX,
  coordinateY,
  isCovered,
  isAttacked,
  setCursorLocation,
}: ITilePlayerProps) => {
  const { handleReDragStart, handleDragMove, handleDragEnd, handleDragCancel } = useShipDeployment();
  const { gamePhase } = useGameStore();

  const canChangePosition = Boolean(gamePhase === "prestart" && isCovered);
  const validCoordinate = isValidCoordinate(coordinateX, coordinateY);

  const coordinates: TCoordinate = { x: coordinateX, y: coordinateY };
  const text = isAxisYTile(coordinates)
    ? coordinateY.toString()
    : isAxisXTile(coordinates)
      ? coordinateX
      : null;

  const { shipPart = "", orientation = "", isRedeploy } = isCovered || {};

  const combinedClasses = clsx(
    css["BattleMap-tile"],
    css["is-player"],
    isCovered && [css["is-covered"], css[shipPart], css[orientation]],
    isAttacked && css["is-attacked"],
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
      {...bind()}
    >
      <span className={css["BattleMap-tileText"]}>{text}</span>
    </div>
  );
};
