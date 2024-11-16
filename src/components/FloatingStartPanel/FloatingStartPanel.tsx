import { Button } from "../button";
import { Panel } from "../Panel";
import { IFloatingStartPanelProps } from "./FloatingStartPanel.types";
import css from "./FloatingStartPanel.module.css";
import { MAP_SIZE } from "~/constants";

export const FloatingStartPanel = ({
  onClick,
  isStartButtonDisabled,
}: IFloatingStartPanelProps) => {
  return (
    <div
      className={css["FloatingStartPanel"]}
      style={{
        left: `calc(50% + (var(--size-32) + (var(--tile-size) * ${
          MAP_SIZE + 1
        }) / 2))`,
      }}
    >
      <Panel width="250px" height="120px" shadowSize="shadow-l">
        <div className={css["FloatingStartPanel-content"]}>
          <Button
            text="Start"
            disabled={isStartButtonDisabled}
            onClick={onClick}
          />
        </div>
      </Panel>
    </div>
  );
};
