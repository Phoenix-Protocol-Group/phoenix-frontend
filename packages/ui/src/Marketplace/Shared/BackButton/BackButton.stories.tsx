import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import BackButton from "./BackButton";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof BackButton> = {
  title: "Marketplace/Shared/BackButton",
  // @ts-ignore
  component: BackButton,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof BackButton>;

export const Primary: Story = {
  args: {},
};
