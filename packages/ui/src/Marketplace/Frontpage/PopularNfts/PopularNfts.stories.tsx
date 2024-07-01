import type { Meta, StoryObj } from "@storybook/react";
import PopularNfts from "./PopularNfts";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof PopularNfts> = {
  title: "Marketplace/Frontpage/PopularNfts",
  // @ts-ignore
  component: PopularNfts,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof PopularNfts>;

const demoItem = {
  id: "1234",
  image: "/banklocker.png",
  collectionName: "collection",
  nftName: "NFT Name",
  price: "21.3K",
  volume: "42.5K",
  icon: "/cryptoIcons/btc.svg"
};

export const Primary: Story = {
  args: {
    entries: [demoItem, demoItem, demoItem, demoItem, demoItem, demoItem],
  },
};

export const Slider: Story = {
  args: {
    entries: [demoItem, demoItem, demoItem, demoItem, demoItem,  demoItem],
    forwardClick: () => {},
    backwardClick: () => {},
    activeTime: "7d",
    onViewAllClick: () => {}
  },
};
