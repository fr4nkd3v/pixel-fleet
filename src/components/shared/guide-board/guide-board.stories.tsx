import type { Meta, StoryObj } from "@storybook/react";
import { GuideBoard } from "./guide-board";

const meta: Meta<typeof GuideBoard> = {
  title: "Guide Board",
  component: GuideBoard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GuideBoard>;

export const Default: Story = {};
