import { IPanelProps } from "./panel.types";
import css from "./panel.module.css";

export const Panel = ({
  children,
  width = "auto",
  height = "auto",
  shadowSize = "shadow-s",
}: IPanelProps) => {
  return (
    <div
      className={css["panel"]}
      style={{ width, height, boxShadow: `var(--${shadowSize})` }}
    >
      {children}
    </div>
  );
};
