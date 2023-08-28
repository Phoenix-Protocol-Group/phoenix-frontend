import type { Meta, StoryObj } from "@storybook/react";
import MainStats from "./MainStats";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof MainStats> = {
  title: "Skeletons/MainStats",
  // @ts-ignore
  component: MainStats,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof MainStats>;

export const Primary: Story = {
};
