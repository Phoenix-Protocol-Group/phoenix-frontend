import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {AssetSelector} from "./AssetSelector";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof AssetSelector> = {
  title: "Components/AssetSelector",
  // @ts-ignore
  component: AssetSelector,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof AssetSelector>;

export const Primary: Story = {
  args: {
  },
};
