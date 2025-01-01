import { ICardProps } from "./card.types";
import css from "./card.module.css";

export const Card = ({
  children,
  width = "auto",
  height = "auto",
  shadowSize = "shadow-s",
}: ICardProps) => {
  return (
    <div
      className={css["Card"]}
      style={{ width, height, boxShadow: `var(--${shadowSize})` }}
    >
      {children}
    </div>
  );
};
