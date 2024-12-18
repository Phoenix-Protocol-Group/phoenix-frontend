import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { UnstakeInfoModal } from "./UnstakeInfoModal";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof UnstakeInfoModal> = {
  title: "General/UnstakeInfoModal",
  // @ts-ignore
  component: UnstakeInfoModal,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof UnstakeInfoModal>;

export const General: Story = {
  args: {
    open: true,
    onConfirm: () => {},
    onClose: () => {},
  },
};
