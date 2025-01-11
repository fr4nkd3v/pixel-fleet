import { Button, Card, IconButton, InputGroup } from "~/components";
import css from "./action-bar.module.css";
import { useGameStore, usePlayerStore } from "~/stores";
import { useTranslation } from "react-i18next";
import { IActionBarProps } from "./action-bar.types";

export const ActionBar = ({
  coordinateYInputRef,
  onStart,
}: IActionBarProps) => {
  const handleSubmit = () => console.log("submit");
  const { gamePhase } = useGameStore();
  const { fleet: playerFleet } = usePlayerStore();
  const { t } = useTranslation();

  const isPlayerFleetDeployed = playerFleet.every((ship) => ship.isDeployed);
  const isGameStart = gamePhase === "start";

  const startControl = (
    <form className={css["ActionBar"]} onSubmit={handleSubmit}>
      <Button
        text={t("game:button.start")}
        variant="primary"
        onClick={onStart}
        fullWidth
      />
    </form>
  );

  const attackControl = (
    <form className={css["ActionBar"]} onSubmit={handleSubmit}>
      <div className={css["ActionBar-inputsGroup"]}>
        <div className={css["ActionBar-inputWrapper"]}>
          <InputGroup
            addonType="numeric"
            addonLocation="leading"
            id="coordinate-x"
            variant="primary"
            inputClassName={css["ActionBar-input"]}
          />
        </div>
        <div className={css["ActionBar-inputWrapper"]}>
          <InputGroup
            addonType="alphabetic"
            addonLocation="trailing"
            id="coordinate-y"
            variant="primary"
            innerRef={coordinateYInputRef}
            inputClassName={css["ActionBar-input"]}
          />
        </div>
      </div>

      <IconButton iconName="sight" type="submit" />
    </form>
  );

  return (
    <Card
      cardClassName={css["Container-ActionBar"]}
      disabled={!isPlayerFleetDeployed}
      fullWidth
    >
      {isGameStart ? attackControl : startControl}
    </Card>
  );
};
