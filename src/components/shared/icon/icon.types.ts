export interface IIconBaseProps {
  color?: string;
  size?: string;
}

export type TIconName = "ship" | "sight";

export interface IIconProps extends IIconBaseProps {
  name: TIconName;
}
