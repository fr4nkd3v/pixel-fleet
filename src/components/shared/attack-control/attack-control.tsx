import { FormEvent, useRef } from "react";
import { Card } from "../card";
import css from "./attack-control.module.css";
import { IAttackControlProps } from "./attack-control.types";
import { IconButton } from "../icon-button";
import clsx from "clsx";
import { Input } from "../input";
import { useGameStore, usePlayerStore } from "~/stores";
import { checkCoordinateValue } from "~/utils";

export function AttackControl({ coordinateYInputRef }: IAttackControlProps) {
  const {
    targetCoordinates,
    updateTargetCoordinateX: updatePlayerTargetCoordinateX,
    updateTargetCoordinateY: updatePlayerTargetCoordinateY,
  } = usePlayerStore();
  const { gamePhase, isPlayerTurn, isShooting, startsShooting } =
    useGameStore();

  const disabled = !isPlayerTurn || gamePhase !== "start" || isShooting;

  const inputY = useRef<HTMLInputElement | null>(null);
  const inputX = useRef<HTMLInputElement | null>(null);

  const { x: targetXCoordinate, y: targetYCoordinate } = targetCoordinates;

  const handleChangeTargetCoordinates = (
    coordinateAxis: "x" | "y",
    value: string
  ) => {
    if (coordinateAxis === "x" && checkCoordinateValue("x", value)) {
      updatePlayerTargetCoordinateX(value);
    } else if (coordinateAxis === "y" && checkCoordinateValue("y", value)) {
      updatePlayerTargetCoordinateY(Number(value));
    }
  };

  const handleChangeCoordinateY = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    if (value.length > 2) {
      handleChangeTargetCoordinates("y", value[2]);
    } else if (value.length > 1) {
      handleChangeTargetCoordinates(
        "y",
        Number(value) === 10 ? value : value[1]
      );
    } else {
      handleChangeTargetCoordinates("y", value);
    }
  };

  const handleChangeCoordinateX = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    handleChangeTargetCoordinates("x", value.length > 1 ? value[1] : value);
  };

  const handleKeyDownInputY = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") inputX.current?.focus();
  };

  const handleKeyDownInputX = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") inputY.current?.focus();
  };

  const handleShoot = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    inputX.current?.blur();
    inputY.current?.blur();
    if (targetXCoordinate && targetYCoordinate) startsShooting();
  };

  return (
    <div
      className={clsx(
        css["AttackControl-root"],
        disabled && css["is-disabled"]
      )}
    >
      <Card>
        <form className={css["AttackControl-wrapper"]} onSubmit={handleShoot}>
          <div className={css["AttackControl"]}>
            <div className="nes-field is-inline">
              <label
                htmlFor="coordinate-y"
                className={css["AttackControl-label"]}
              >
                12
                <br />
                34
              </label>
              <Input
                variant="primary"
                type="text"
                id="coordinate-y"
                className={`nes-input ${css["AttackControl-input"]}`}
                innerRef={(element) => {
                  inputY.current = element;
                  if (coordinateYInputRef)
                    coordinateYInputRef.current = element;
                }}
                onKeyDown={handleKeyDownInputY}
                onFocus={() => inputY.current?.select()}
                onInput={handleChangeCoordinateY}
                value={
                  targetCoordinates?.y ? targetCoordinates?.y.toString() : "-"
                }
              />
            </div>
            <div className="nes-field is-inline">
              <Input
                variant="primary"
                type="text"
                id="coordinate-x"
                className={`nes-input ${css["AttackControl-input"]}`}
                innerRef={inputX}
                onKeyDown={handleKeyDownInputX}
                onFocus={() => inputX.current?.select()}
                onInput={handleChangeCoordinateX}
                value={targetCoordinates?.x || "-"}
              />
              <label
                htmlFor="coordinate-x"
                className={css["AttackControl-label"]}
              >
                AB
                <br />
                CD
              </label>
            </div>
          </div>
          <IconButton
            type="submit"
            iconName="sight"
            disabled={!targetXCoordinate || !targetYCoordinate}
          />
        </form>
      </Card>
    </div>
  );
}
