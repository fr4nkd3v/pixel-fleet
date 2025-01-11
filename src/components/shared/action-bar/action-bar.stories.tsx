import type { Meta, StoryObj } from "@storybook/react";
import { ActionBar } from "./action-bar";

const meta: Meta<typeof ActionBar> = {
  title: "ActionBar",
  component: ActionBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "35rem" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

export const Default: Story = {};
