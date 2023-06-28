import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {SwapContainer} from "./SwapContainer";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof SwapContainer> = {
  title: "Components/SwapContainer",
  // @ts-ignore
  component: SwapContainer,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof SwapContainer>;

export const Primary: Story = {
  args: {
  },
};
