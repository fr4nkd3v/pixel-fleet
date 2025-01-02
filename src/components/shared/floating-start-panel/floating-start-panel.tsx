import { Button } from "../button";
import { Card } from "../card";
import { IFloatingStartPanelProps } from "./floating-start-panel.types";
import css from "./floating-start-panel.module.css";
import { MAP_SIZE } from "~/constants";
import { useTranslation } from "react-i18next";

export const FloatingStartPanel = ({
  onClick,
  isStartButtonDisabled,
}: IFloatingStartPanelProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={css["FloatingStartPanel"]}
      style={{
        left: `calc(50% + (var(--size-32) + (var(--tile-size) * ${
          MAP_SIZE + 1
        }) / 2))`,
      }}
    >
      <Card>
        <div className={css["FloatingStartPanel-content"]}>
          <Button
            text={t("game:button.start")}
            disabled={isStartButtonDisabled}
            onClick={onClick}
          />
        </div>
      </Card>
    </div>
  );
};
