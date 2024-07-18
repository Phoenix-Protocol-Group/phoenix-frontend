import type { Meta, StoryObj } from "@storybook/react";
import CreateNft from "./CreateNft";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CreateNft> = {
  title: "Marketplace/CreateNft",
  // @ts-ignore
  component: CreateNft,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof CreateNft>;

export const Primary: Story = {
  args: {},
};
