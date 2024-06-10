import type { Meta, StoryObj } from "@storybook/react";
import TopCollections from "./TopCollections";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof TopCollections> = {
  title: "Marketplace/Frontpage/TopCollections",
  // @ts-ignore
  component: TopCollections,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof TopCollections>;

const demoItem = {
  id: "1234",
  previewImage: "/demo_nft.png",
  collectionName: "Demo Name",
  floorPrice: "1500.00",
  bestOffer: "1500.00",
  volume: "1500.00",
  volumePercent: "+20%",
  owners: "2137",
  ownersPercent: "20% Unique",
  forSalePercent: "16.19%",
  forSaleNumbers: "68 / 421",
};

export const Primary: Story = {
  args: {
    activeSort: {column: "collection", direction: "asc"},
    activeCurrency: "crypto",
    activeTime: "1d",
    entries: [demoItem, demoItem, demoItem, demoItem, demoItem],
  },
};
