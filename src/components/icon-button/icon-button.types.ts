import { ButtonHTMLAttributes } from "react";
import { TIconName } from "../icon/icon.types";

export interface IIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconName: TIconName;
}
