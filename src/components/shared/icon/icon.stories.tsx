import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./icon";

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

const template: Story["render"] = (args) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
    <Icon name="ship" color={args.color} size={args.size} />
    <Icon name="sight" color={args.color} size={args.size} />
  </div>
);

export const IconGallery: Story = {
  render: template,
  args: {
    color: "#000000",
    size: "32px",
  },
};
