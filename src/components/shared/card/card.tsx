import { ICardProps } from "./card.types";
import css from "./card.module.css";
import clsx from "clsx";

export const Card = ({
  children,
  fullWidth = false,
  variant = "light",
  disabled = false,
  notShadow = false,
}: ICardProps) => {
  return (
    <div
      className={clsx(
        css["Card"],
        css[`is-${variant}`],
        notShadow && css["not-shadow"],
        disabled && css["is-disabled"]
      )}
      style={{ width: fullWidth ? "100%" : "fit-content" }}
    >
      {children}
    </div>
  );
};
