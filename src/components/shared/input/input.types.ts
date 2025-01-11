import { InputHTMLAttributes, Ref } from "react";

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "primary";
  innerRef?: Ref<HTMLInputElement>;
}
