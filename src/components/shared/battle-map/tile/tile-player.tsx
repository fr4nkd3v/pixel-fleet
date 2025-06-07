import { type ITileBaseProps } from "./tile.types";
import css from "./tile.module.css";
import clsx from "clsx";
import { getTileLabelByIndexes, getCoordinatesByIndexes } from "~/utils";
import { useGameStore } from "~/stores";
import { useDrag } from "@use-gesture/react";
import { useShipDeployment } from "~/hooks";
import { useCursorLocation } from "~/hooks/use-cursor-location";

export const TilePlayer = ({ indexes, isCovered, isAttacked }: ITileBaseProps) => {
  const { handleReDragStart, handleDragMove, handleDragEnd, handleDragCancel, handleChangeDirection } =
    useShipDeployment();
  const { gamePhase } = useGameStore();
  const { setCursorLocation } = useCursorLocation();

  const canChangePosition = Boolean(gamePhase === "prestart" && isCovered);
  const coordinates = getCoordinatesByIndexes(indexes);
  const tileLabel = getTileLabelByIndexes(indexes);

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

  const handleOnContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    const target = event.target as HTMLElement;
    handleChangeDirection(target);
  };

  return (
    <div
      className={combinedClasses}
      data-coordinate-x={coordinates.x}
      data-coordinate-y={coordinates.y}
      {...bind()}
      onContextMenu={handleOnContextMenu}
    >
      <span className={css["BattleMap-tileText"]}>{tileLabel}</span>
    </div>
  );
};
