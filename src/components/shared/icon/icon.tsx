import { IIconProps, TIconName } from "./icon.types";

import { ShipIcon } from "./ship-icon";
import { SightIcon } from "./sight-icon";
import { MapIcon } from "./map-icon";
import { FireballIcon } from "./fireball-icon";
import { SkullIcon } from "./skull-icon";

export const Icon = ({ name, ...args }: IIconProps) => {
  const IconMapper: Record<TIconName, JSX.Element> = {
    ship: <ShipIcon {...args} />,
    sight: <SightIcon {...args} />,
    map: <MapIcon {...args} />,
    fireball: <FireballIcon {...args} />,
    skull: <SkullIcon {...args} />,
    // Add more icons as needed
  };

  return IconMapper[name];
};
