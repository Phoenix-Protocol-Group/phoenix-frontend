import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Divider from "./Divider";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Divider> = {
  title: "Marketplace/Shared/Divider",
  // @ts-ignore
  component: Divider,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Divider>;

export const Primary: Story = {
  args: {},
};
