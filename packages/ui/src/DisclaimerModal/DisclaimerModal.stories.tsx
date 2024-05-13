import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DisclaimerModal } from "./DisclaimerModal";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof DisclaimerModal> = {
  title: "General/DisclaimerModal",
  // @ts-ignore
  component: DisclaimerModal,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof DisclaimerModal>;

export const General: Story = {
  args: {
    open: true,
    setOpen: () => {},
  },
};
