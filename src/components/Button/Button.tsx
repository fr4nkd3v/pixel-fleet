import { IButtonProps } from "./button.types";
import css from "./button.module.css";

export const Button = ({
  variant = "default",
  text,
  disabled = false,
  onClick,
}: IButtonProps) => {
  const cssClasses = `nes-btn ${css["button"]} ${
    disabled ? "is-disabled" : ""
  } ${css[variant]}`;

  return (
    <button type="button" className={cssClasses} onClick={onClick}>
      {text}
    </button>
  );
};
