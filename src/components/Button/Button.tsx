import clsx from "clsx";
import { IButtonProps } from "./button.types";
import css from "./button.module.css";

export const Button = ({
  variant = "default",
  text,
  disabled = false,
  onClick,
}: IButtonProps) => {
  const combinedClasses = clsx(
    "nes-btn",
    css["button"],
    css[variant],
    disabled && "is-disabled"
  );

  return (
    <button type="button" className={combinedClasses} onClick={onClick}>
      {text}
    </button>
  );
};
