import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TourModal } from "./TourModal";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof TourModal> = {
  title: "General/TourModal",
  component: TourModal,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof TourModal>;

export const StartTour: Story = {
  args: {
    open: true,
    setOpen: () => console.log,
    onClick: () => console.log,
  },
};
