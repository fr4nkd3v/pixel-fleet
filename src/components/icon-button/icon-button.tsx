import clsx from "clsx";
import css from "./icon-button.module.css";
import { Icon } from "../icon";
import { IIconButtonProps } from "./icon-button.types";

export const IconButton = ({ iconName, ...props }: IIconButtonProps) => {
  return (
    <button
      className={clsx(
        "nes-btn",
        css["icon-button"],
        props.disabled && "is-disabled"
      )}
      {...props}
    >
      <Icon name={iconName} size="100%" />
    </button>
  );
};
