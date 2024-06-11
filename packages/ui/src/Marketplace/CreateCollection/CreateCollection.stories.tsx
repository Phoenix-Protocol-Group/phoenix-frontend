import type { Meta, StoryObj } from "@storybook/react";
import CreateCollection from "./CreateCollection";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CreateCollection> = {
  title: "Marketplace/CreateCollection",
  // @ts-ignore
  component: CreateCollection,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof CreateCollection>;

export const Primary: Story = {
  args: {},
};
