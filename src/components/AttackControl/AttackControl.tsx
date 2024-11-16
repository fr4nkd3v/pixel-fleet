import { Button } from "../button";
import { Panel } from "../Panel";
import css from "./AttackControl.module.css";
import { IAttackControlProps } from "./AttackControl.types";

export function AttackControl({
  targetCoordinates,
  disabled,
  onChangeTargetCoordinates,
  onShootButtonClick,
}: IAttackControlProps) {
  return (
    <div
      className={`${css["AttackControl-root"]} ${
        disabled ? css["is-disabled"] : ""
      }`}
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
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeTargetCoordinates("y", event.target.value);
                }}
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
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeTargetCoordinates("x", event.target.value);
                }}
                value={targetCoordinates?.x || "-"}
              />
            </div>
            <span className={css["AttackControl-label"]}>
              AB
              <br />
              CD
            </span>
          </div>
          <Button text="attack" onClick={onShootButtonClick} />
        </div>
      </Panel>
    </div>
  );
}
