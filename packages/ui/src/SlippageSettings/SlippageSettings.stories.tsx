import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SlippageSettings } from "./SlippageSettings";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof SlippageSettings> = {
  title: "Swap/SlippageSettings",
  // @ts-ignore
  component: SlippageSettings,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof SlippageSettings>;

export const Primary: Story = {
  args: {
    options: ["0.1%", "0.5%", "2%"],
    selectedOption: 1,
  },
};
