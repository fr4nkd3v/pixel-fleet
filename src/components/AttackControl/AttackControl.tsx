import { Button } from "../Button";
import { Panel } from "../Panel";
import styles from './AttackControl.module.css';
import { IAttackControlProps } from "./AttackControl.types";

export function AttackControl(
  { targetCoordinates, onChangeTargetCoordinates, onShoot }: IAttackControlProps
) {
  return (
    <Panel shadowSize="shadow-m">
      <div className={styles['AttackControl-container']}>
        <div className={styles["AttackControl"]}>
          <span className={styles['AttackControl-label']}>
            12<br/>34
          </span>
          <div className="nes-field is-inline">
            <input
              type="number"
              id="coordinate-y"
              className={`nes-input ${styles['AttackControl-input']}`}
              onInput={
                (event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeTargetCoordinates('y', event.target.value)
                }
              }
              value={targetCoordinates.y.toString()}
            />
          </div>
          <div className="nes-field is-inline">
            <input
              type="text"
              id="coordinate-x"
              className={`nes-input ${styles['AttackControl-input']}`}
              onInput={
                (event: React.ChangeEvent<HTMLInputElement>) => {
                  onChangeTargetCoordinates('x', event.target.value)
                }
              }
              value={targetCoordinates.x}
            />
          </div>
          <span className={styles['AttackControl-label']}>
            AB<br/>CD
          </span>
        </div>
        <Button
          text="attack"
          onClick={onShoot}
        />
      </div>
    </Panel>
  )
}
