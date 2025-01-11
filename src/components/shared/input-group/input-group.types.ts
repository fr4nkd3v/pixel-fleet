import { IInputProps } from "~/components/shared/input/input.types";

export interface IInputGroupProps extends IInputProps {
  addonType: "numeric" | "alphabetic";
  addonLocation?: "leading" | "trailing";
  inputClassName?: string;
}
