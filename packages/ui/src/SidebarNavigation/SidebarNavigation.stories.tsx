import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SidebarNavigation } from "./SidebarNavigation";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof SidebarNavigation> = {
  title: "Components/SidebarNavigation",
  component: SidebarNavigation
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof SidebarNavigation>;

export const Primary: Story = {
  args: {
    label: "Primary",
    size: "medium",
    type: "primary",
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    type: "secondary",
    label: "Secondary",
  },
};
