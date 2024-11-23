import { useRef } from "react";
import { Panel } from "../panel";
import css from "./attack-control.module.css";
import { IAttackControlProps } from "./attack-control.types";
import { IconButton } from "../icon-button";
import clsx from "clsx";

export function AttackControl({
  targetCoordinates,
  disabled,
  onChangeTargetCoordinates,
  onShootButtonClick,
}: IAttackControlProps) {
  const inputY = useRef<HTMLInputElement | null>(null);
  const inputX = useRef<HTMLInputElement | null>(null);

  const handleChangeCoordinateY = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    if (value.length > 2) {
      onChangeTargetCoordinates("y", value[2]);
    } else if (value.length > 1) {
      onChangeTargetCoordinates("y", Number(value) === 10 ? value : value[1]);
    } else {
      onChangeTargetCoordinates("y", value);
    }
  };

  const handleChangeCoordinateX = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    onChangeTargetCoordinates("x", value.length > 1 ? value[1] : value);
  };

  const handleKeyDownInputY = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") inputX.current?.focus();
  };

  const handleKeyDownInputX = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") inputY.current?.focus();
  };

  return (
    <div
      className={clsx(
        css["AttackControl-root"],
        disabled && css["is-disabled"]
      )}
    >
      <Panel shadowSize="shadow-m">
        <div className={css["AttackControl-wrapper"]}>
          <div className={css["AttackControl"]}>
            <span className={css["AttackControl-label"]}>
              12
              <br />
              34
            </span>
            <div className="nes-field is-inline">
              <input
                type="text"
                id="coordinate-y"
                className={`nes-input ${css["AttackControl-input"]}`}
                ref={inputY}
                onKeyDown={handleKeyDownInputY}
                onFocus={() => inputY.current?.select()}
                onInput={handleChangeCoordinateY}
                value={
                  targetCoordinates?.y ? targetCoordinates?.y.toString() : "-"
                }
              />
            </div>
            <div className="nes-field is-inline">
              <input
                type="text"
                id="coordinate-x"
                className={`nes-input ${css["AttackControl-input"]}`}
                ref={inputX}
                onKeyDown={handleKeyDownInputX}
                onFocus={() => inputX.current?.select()}
                onInput={handleChangeCoordinateX}
                value={targetCoordinates?.x || "-"}
              />
            </div>
            <span className={css["AttackControl-label"]}>
              AB
              <br />
              CD
            </span>
          </div>
          <IconButton iconName="sight" onClick={onShootButtonClick} />
        </div>
      </Panel>
    </div>
  );
}
