import type { Meta, StoryObj } from "@storybook/react";

import { Card } from "./card";

const meta: Meta<typeof Card> = {
  title: "Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  args: {
    children: "this is a child",
  },
};
