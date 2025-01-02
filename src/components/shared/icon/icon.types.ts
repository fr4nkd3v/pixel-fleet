export interface IIconBaseProps {
  color?: string;
  size?: string;
}

export type TIconName = "ship" | "sight" | "map" | "fireball" | "skull";

export interface IIconProps extends IIconBaseProps {
  name: TIconName;
}
