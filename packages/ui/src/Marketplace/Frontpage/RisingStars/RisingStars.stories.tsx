import type { Meta, StoryObj } from "@storybook/react";
import RisingStars from "./RisingStars";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof RisingStars> = {
  title: "Marketplace/RisingStars",
  // @ts-ignore
  component: RisingStars,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof RisingStars>;

const demoItem = {
  image: "/demo_nft.png",
  collectionName: "Testcollection",
  percent: 50
};

export const Primary: Story = {
  args: {
    entries: [demoItem, demoItem, demoItem,demoItem, demoItem, demoItem, demoItem,demoItem, demoItem],
    activeTime: "7d",
  },
};
