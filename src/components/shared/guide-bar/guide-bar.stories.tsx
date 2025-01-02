import type { Meta, StoryObj } from "@storybook/react";
import { GuideBar } from "./guide-bar";

const meta: Meta<typeof GuideBar> = {
  title: "GuideBar",
  component: GuideBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GuideBar>;

export const Default: Story = {};
