import { IconButton, InputGroup } from "~/components";
import css from "../action-bar.module.css";
import { FormEvent, useEffect, useRef } from "react";
import { useGameStore, usePlayerStore } from "~/stores";
import { checkCoordinateValue, coordinateYToLabel, coordinateYToNumber } from "~/utils";
import { TAxis } from "~/types";

export const AttackControl = () => {
  const inputX = useRef<HTMLInputElement | null>(null);
  const inputY = useRef<HTMLInputElement | null>(null);

  const { targetCoordinates, updateTargetCoordinateX, updateTargetCoordinateY } = usePlayerStore();
  const { startsShooting, isPlayerTurn } = useGameStore();

  const changeTargetCoordinates = (axis: TAxis, value: string) => {
    if (axis === "x" && checkCoordinateValue("x", value)) {
      updateTargetCoordinateX(Number(value));
    } else if (axis === "y" && checkCoordinateValue("y", value)) {
      const coordinateY = coordinateYToNumber(value);
      updateTargetCoordinateY(coordinateY);
    }
  };

  const handleChangeCoordinateY = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    changeTargetCoordinates("y", value.length > 1 ? value[1] : value);
  };

  const handleChangeCoordinateX = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value.length > 2) {
      changeTargetCoordinates("x", value[2]);
    } else if (value.length > 1) {
      changeTargetCoordinates("x", Number(value) === 10 ? value : value[1]);
    } else {
      changeTargetCoordinates("x", value);
    }
  };

  const handleKeyDownInputY = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") inputX.current?.focus();
  };

  const handleKeyDownInputX = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft" && inputY) inputY.current?.focus();
  };

  const handleShoot = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    inputX.current?.blur();
    if (inputY) inputY.current?.blur();
    if (targetCoordinates.x && targetCoordinates.y) startsShooting();
  };

  useEffect(() => {
    if (!isPlayerTurn) return;
    if (inputY) inputY.current?.focus();
  }, [inputY, isPlayerTurn]);

  return (
    <form className={css["ActionBar"]} onSubmit={handleShoot}>
      <div className={css["ActionBar-inputsGroup"]}>
        <div className={css["ActionBar-inputWrapper"]}>
          <InputGroup
            inputClassName={css["ActionBar-input"]}
            addonType="alphabetic"
            addonLocation="leading"
            id="coordinate-y"
            variant="primary"
            innerRef={inputY}
            onKeyDown={handleKeyDownInputY}
            onInput={handleChangeCoordinateY}
            onFocus={() => inputY && inputY.current?.select()}
            value={targetCoordinates.y ? coordinateYToLabel(targetCoordinates.y) : "-"}
            autoComplete="off"
          />
        </div>
        <div className={css["ActionBar-inputWrapper"]}>
          <InputGroup
            inputClassName={css["ActionBar-input"]}
            addonType="numeric"
            addonLocation="trailing"
            id="coordinate-x"
            variant="primary"
            innerRef={inputX}
            onKeyDown={handleKeyDownInputX}
            onInput={handleChangeCoordinateX}
            onFocus={() => inputX.current?.select()}
            value={targetCoordinates.x ?? "-"}
            autoComplete="off"
          />
        </div>
      </div>

      <IconButton iconName="sight" type="submit" />
    </form>
  );
};
