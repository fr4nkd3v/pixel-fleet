import { IIconProps, TIconName } from "./icon.types";

import { ShipIcon } from "./ship-icon";
import { SightIcon } from "./sight-icon";

export const Icon = ({ name, ...args }: IIconProps) => {
  const IconMapper: Record<TIconName, JSX.Element> = {
    ship: <ShipIcon {...args} />,
    sight: <SightIcon {...args} />,
    // Add more icons as needed
  };

  return IconMapper[name];
};
