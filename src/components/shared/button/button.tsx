import clsx from "clsx";
import { IButtonProps } from "./button.types";
import css from "./button.module.css";

export const Button = ({
  variant = "default",
  text,
  disabled = false,
  fullWidth = false,
  onClick,
}: IButtonProps) => {
  const combinedClasses = clsx(
    "nes-btn",
    css["button"],
    css[variant],
    disabled && "is-disabled"
  );

  return (
    <button
      type="button"
      className={combinedClasses}
      onClick={onClick}
      style={{ width: fullWidth ? "100%" : "auto" }}
    >
      {text}
    </button>
  );
};
