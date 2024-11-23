import type { Meta, StoryObj } from "@storybook/react";

import { ResultsModal } from "./results-modal";
import { resultsModalTypes } from "./results-modal.types";

const meta = {
  title: "Results Modal",
  component: ResultsModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isVisible: { control: "boolean" },
    type: { control: "select", options: resultsModalTypes },
    onToHomeClick: { action: "to home" },
    onRetryClick: { action: "retry" },
  },
} satisfies Meta<typeof ResultsModal>;

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
