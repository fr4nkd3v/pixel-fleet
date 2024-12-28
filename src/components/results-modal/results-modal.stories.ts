import type { Meta, StoryObj } from "@storybook/react";

import { ResultsModal } from "./results-modal";

const meta = {
  title: "Results Modal",
  component: ResultsModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onToHomeClick: { action: "to home" },
    onRetryClick: { action: "retry" },
  },
} satisfies Meta<typeof ResultsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Win: Story = {
  args: {
    onToHomeClick: () => console.log("To home clicked"),
    onRetryClick: () => console.log("Retry clicked"),
  },
};

export const Lose: Story = {
  args: {
    onToHomeClick: () => console.log("To home clicked"),
    onRetryClick: () => console.log("Retry clicked"),
  },
};
