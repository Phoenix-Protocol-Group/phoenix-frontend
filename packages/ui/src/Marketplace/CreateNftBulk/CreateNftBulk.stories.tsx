import type { Meta, StoryObj } from "@storybook/react";
import CreateNftBulk from "./CreateNftBulk";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CreateNftBulk> = {
  title: "Marketplace/CreateNftBulk",
  // @ts-ignore
  component: CreateNftBulk,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof CreateNftBulk>;

export const Primary: Story = {
  args: {},
};
