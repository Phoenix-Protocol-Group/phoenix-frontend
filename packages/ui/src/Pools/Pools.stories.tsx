import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pools } from "./Pools";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Pools> = {
  title: "General/Pools",
  component: Pools
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Pools>;

export const Primary: Story = {
  args: {
    items: [
      "XLM - USDT",
      "XLM - USDT",
      "XLM - USDT",
      "foo",
      "foo",
      "foo"
    ]
  },
};
