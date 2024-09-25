import { IPanelProps } from "./Panel.types";
import styles from './Panel.module.css';

export const Panel = ({ children, width = 'auto', height = 'auto' }: IPanelProps) => {
  return (
    <div
      className={styles['panel']}
      style={{ width, height}}
    >
      {children}
    </div>
  )
}
