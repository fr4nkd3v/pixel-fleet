import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Button } from "./button";
import { buttonVariants } from "./button.types";

const meta = {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: buttonVariants },
    text: { control: "text" },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Button",
    disabled: false,
    onClick: fn(),
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    text: "Button",
    disabled: false,
    onClick: fn(),
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    text: "Button",
    disabled: false,
    onClick: fn(),
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    text: "Button",
    disabled: false,
    onClick: fn(),
  },
};

export const Dark: Story = {
  args: {
    variant: "dark",
    text: "Button",
    disabled: false,
    onClick: fn(),
  },
};
