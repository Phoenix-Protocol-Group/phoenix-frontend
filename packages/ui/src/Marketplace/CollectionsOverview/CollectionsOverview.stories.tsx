import type { Meta, StoryObj } from "@storybook/react";
import CollectionsOverview from "./CollectionsOverview";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CollectionsOverview> = {
  title: "Marketplace/CollectionsOverview",
  // @ts-ignore
  component: CollectionsOverview,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof CollectionsOverview>;

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
    onEntryClick: (id: string) => {alert(id)},
    searchTerm: "",
    setSearchTerm: (searchTerm: string) => {},
    category: "all",
    setCategory: (category: string) => {},
    categoryItems: [
      {value: "all", label: "All Categories"}, 
      {value: "foo", label: "Foo"}, 
      {value: "bar", label: "Bar"}
    ],
    activeSort: {column: "collection", direction: "asc"},
    activeCurrency: "crypto",
    activeTime: "1d",
    entries: [demoItem, demoItem, demoItem, demoItem, demoItem],
  },
};

