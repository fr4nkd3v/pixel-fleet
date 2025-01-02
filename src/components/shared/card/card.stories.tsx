import type { Meta, StoryObj } from "@storybook/react";

import { Card } from "./card";

const meta: Meta<typeof Card> = {
  title: "Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Light: Story = {
  args: {
    children: "this is a child",
  },
};

export const Dark: Story = {
  args: {
    children: "this is a child",
    variant: "dark",
  },
};

export const Disabled: Story = {
  args: {
    children: (
      <button onClick={() => console.log("click")}>this is a button</button>
    ),
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "this is a child",
    fullWidth: true,
  },
};
