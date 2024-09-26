import { IPanelProps } from "./Panel.types";
import styles from './Panel.module.css';

export const Panel = ({ children, width = 'auto', height = 'auto', shadowSize='shadow-s' }: IPanelProps) => {
  return (
    <div
      className={styles['panel']}
      style={{ width, height, boxShadow: `var(--${shadowSize})`}}
    >
      {children}
    </div>
  )
}
