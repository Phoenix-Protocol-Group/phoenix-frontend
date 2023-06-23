import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: "Primary 😃",
    size: "medium",
    type: "primary",
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    type: "secondary",
    label: "Secondary 😇",
  },
};
