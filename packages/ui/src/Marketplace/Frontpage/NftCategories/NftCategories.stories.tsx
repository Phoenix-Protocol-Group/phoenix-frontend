import type { Meta, StoryObj } from "@storybook/react";
import NftCategories from "./NftCategories";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof NftCategories> = {
  title: "Marketplace/NftCategories",
  // @ts-ignore
  component: NftCategories,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof NftCategories>;

const demoItem = {
  image: "/banklocker.png",
  name: "category 1"
};

export const Primary: Story = {
  args: {
    entries: [demoItem, demoItem, demoItem, demoItem, demoItem, demoItem],
    onViewAllClick: () => {},
  },
};
