import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import CreateOptionCard from "./CreateOptionCard";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CreateOptionCard> = {
  title: "Marketplace/Shared/CreateOptionCard",
  // @ts-ignore
  component: CreateOptionCard,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof CreateOptionCard>;

export const Primary: Story = {
  args: {
    title: "foo",
    description: "Lorem ipsum dolor sit amet",
    onClick: () => {},
  },
};
