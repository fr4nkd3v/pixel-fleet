import clsx from "clsx";
import css from "./icon-button.module.css";
import { Icon } from "../icon";
import { IIconButtonProps } from "./icon-button.types";

export const IconButton = ({ iconName, onClick }: IIconButtonProps) => {
  return (
    <button className={clsx("nes-btn", css["icon-button"])} onClick={onClick}>
      <Icon name={iconName} size="100%" />
    </button>
  );
};
