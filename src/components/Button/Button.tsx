import { type IButtonProps } from "./button.types";

export const Button = ({ text, disabled = false, onClick }: IButtonProps) => {
  return (
    <button
      type="button"
      className={`nes-btn ${disabled ? "is-disabled" : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
