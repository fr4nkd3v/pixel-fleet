import { Button } from "../Button"
import { Panel } from "../Panel"
import { IFloatingStartPanelProps } from "./FloatingStartPanel.types"
import styles from './FloatingStartPanel.module.css';

export const FloatingStartPanel = ({ onClick, isStartButtonDisabled }: IFloatingStartPanelProps) => {
  return (
    <div className={styles['FloatingStartPanel']}>
      <Panel
        width='250px'
        height='120px'
        shadowSize="shadow-l"
      >
        <div className={styles['FloatingStartPanel-content']}>
          <Button
            text='Start'
            disabled={isStartButtonDisabled}
            onClick={onClick}
          />
        </div>
      </Panel>
    </div>
  )
}
