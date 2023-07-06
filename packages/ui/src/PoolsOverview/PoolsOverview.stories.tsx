import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PoolsOverview } from "./PoolsOverview";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof PoolsOverview> = {
  title: "Pools/PoolsOverview",
  // @ts-ignore
  component: PoolsOverview,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof PoolsOverview>;

export const Primary: Story = {
  args: {},
};
