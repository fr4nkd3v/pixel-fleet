export interface IIconBaseProps {
  color?: string;
  size?: string;
}

export type TIconName = "ship" | "sight" | "map";

export interface IIconProps extends IIconBaseProps {
  name: TIconName;
}
