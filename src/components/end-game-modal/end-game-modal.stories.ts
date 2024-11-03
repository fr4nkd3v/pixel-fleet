import type { Meta, StoryObj } from "@storybook/react";

import { EndGameModal } from "./end-game-modal";
import { endGameModalTypes } from "./end-game-modal.types";

const meta = {
  title: "EndGame Modal",
  component: EndGameModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isVisible: { control: "boolean" },
    type: { control: "select", options: endGameModalTypes },
    onToHomeClick: { action: "to home" },
    onRetryClick: { action: "retry" },
  },
} satisfies Meta<typeof EndGameModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Win: Story = {
  args: {
    isVisible: true,
    type: "win",
    onToHomeClick: () => console.log("To home clicked"),
    onRetryClick: () => console.log("Retry clicked"),
  },
};

export const Lose: Story = {
  args: {
    isVisible: true,
    type: "fail",
    onToHomeClick: () => console.log("To home clicked"),
    onRetryClick: () => console.log("Retry clicked"),
  },
};
