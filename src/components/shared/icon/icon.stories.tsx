import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./icon";
import { TIconName } from "./icon.types";

const meta = {
  title: "Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof Icon>;

const template: Story["render"] = (args) => {
  const iconNames: TIconName[] = ["ship", "sight", "map", "fireball", "skull"];
  const icons = iconNames.map((iconName) => (
    <Icon name={iconName} color={args.color} size={args.size} key={iconName} />
  ));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {icons}
    </div>
  );
};

export const IconGallery: Story = {
  render: template,
  args: {
    color: "#000000",
    size: "32px",
  },
};
