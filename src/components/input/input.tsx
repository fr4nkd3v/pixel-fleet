import clsx from "clsx";
import css from "./input.module.css";
import { forwardRef, InputHTMLAttributes, Ref } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "primary";
  innerRef?: Ref<HTMLInputElement>;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "default", className, innerRef, ...props }: InputProps) => {
    const combinedClasses = clsx(
      className,
      css["Input"],
      variant === "primary" && css["primary"],
      "nes-input"
    );

    return <input className={combinedClasses} ref={innerRef} {...props} />;
  }
);
