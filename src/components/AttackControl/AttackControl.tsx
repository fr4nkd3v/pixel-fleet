import { Button } from "../Button";
import { Panel } from "../Panel";
import styles from './AttackControl.module.css';

export function AttackControl() {
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
            />
          </div>
          <div className="nes-field is-inline">
            <input
              type="text"
              id="coordinate-x"
              className={`nes-input ${styles['AttackControl-input']}`}
            />
          </div>
          <span className={styles['AttackControl-label']}>
            AB<br/>CD
          </span>
        </div>
        <Button
          text="attack"
          onClick={() => console.log('click en atacar')}
        />
      </div>
    </Panel>
  )
}
