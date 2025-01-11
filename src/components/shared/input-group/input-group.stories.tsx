import type { Meta, StoryObj } from "@storybook/react";
import { InputGroup } from "./input-group";

const meta: Meta<typeof InputGroup> = {
  title: "InputGroup",
  component: InputGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [(story) => <div style={{ width: "15rem" }}>{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
  args: {
    addonType: "numeric",
    addonLocation: "leading",
    id: "some-id",
    variant: "primary",
    type: "text",
  },
};

export const AddonInTwoDirections: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <InputGroup {...args} addonLocation="leading" />
      <InputGroup {...args} addonLocation="trailing" />
    </div>
  ),
  args: {
    addonType: "numeric",
    id: "some-id",
    variant: "primary",
    type: "text",
  },
};

export const NumericAndAlphabeticAddons: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <InputGroup {...args} addonType="numeric" />
      <InputGroup {...args} addonType="alphabetic" />
    </div>
  ),
  args: {
    addonLocation: "leading",
    id: "some-id",
    variant: "primary",
    type: "text",
  },
};
