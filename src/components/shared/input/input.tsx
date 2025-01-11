import clsx from "clsx";
import { IInputProps } from "./input.types";
import css from "./input.module.css";

export const Input = ({
  variant = "default",
  className,
  innerRef,
  ...props
}: IInputProps) => {
  const combinedClasses = clsx(
    className,
    css["Input"],
    variant === "primary" && css["primary"],
    "nes-input"
  );

  return <input className={combinedClasses} ref={innerRef} {...props} />;
};
