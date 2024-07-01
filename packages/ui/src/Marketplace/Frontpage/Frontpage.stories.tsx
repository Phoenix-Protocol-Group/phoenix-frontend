import type { Meta, StoryObj } from "@storybook/react";
import Frontpage from "./Frontpage";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Frontpage> = {
  title: "Marketplace/Frontpage",
  // @ts-ignore
  component: Frontpage,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Frontpage>;

const demoFeaturedItem = {
  id: "1337",
  image: "/banklocker.png",
  name: "Collection Name",
  price: "21.3K",
  volume: "42.5K",
  icon: "/cryptoIcons/btc.svg"
};

const demoTopCollectionItem = {
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

const demoPopularNftItem = {
  id: "24327824",
  image: "/banklocker.png",
  collectionName: "collection",
  nftName: "NFT Name",
  price: "21.3K",
  volume: "42.5K",
  icon: "/cryptoIcons/btc.svg"
};

const demoRisingStartItem = {
  id: "24327824",
  image: "/demo_nft.png",
  collectionName: "Testcollection",
  percent: 50
};

const demoCategoryItem = {
  id: "foo",
  image: "/banklocker.png",
  name: "category 1"
};

const demoGettingStartedItem = {
  image: "/banklocker.png",
  name: "Create",
  description: "Lorem ipsum dolor sit amet consectetur adipiscing."
};

export const Primary: Story = {
  args: {
    featuredProps: {
      entries: [demoFeaturedItem, demoFeaturedItem, demoFeaturedItem, demoFeaturedItem, demoFeaturedItem, demoFeaturedItem],
      onEntryClick: (id: string) => {alert(id)},
      forwardClick: () => {},
      backwardClick: () => {}
    },
    topCollectionsProps: {
      activeSort: {column: "collection", direction: "asc"},
      handleSort: (column: string) => {},
      activeCurrency: "crypto",
      setActiveCurrency: (view: "crypto" | "usd") => {},
      activeTime: "1d",
      setActiveTime: (time: any) => {},
      entries: [demoTopCollectionItem, demoTopCollectionItem, demoTopCollectionItem, demoTopCollectionItem, demoTopCollectionItem],
      onEntryClick: (id: string) => {alert(id)},
      onViewAllClick: () => {},
    },
    popularNftsProps: {
      entries: [demoPopularNftItem, demoPopularNftItem, demoPopularNftItem, demoPopularNftItem, demoPopularNftItem,  demoPopularNftItem],
      onEntryClick: (id: string) => {alert(id)},
      forwardClick: () => {},
      backwardClick: () => {},
      activeTime: "7d",
      setActiveTime: (time: any) => {},
      onViewAllClick: () => {}
    },
    risingStarsProps: {
      entries: [demoRisingStartItem, demoRisingStartItem, demoRisingStartItem,demoRisingStartItem, demoRisingStartItem, demoRisingStartItem, demoRisingStartItem,demoRisingStartItem, demoRisingStartItem],
      onEntryClick: (id: string) => {alert(id)},
      activeTime: "7d",
      setActiveTime: (time: any) => {},
    },
    nftCategoriesProps: {
      entries: [demoCategoryItem, demoCategoryItem, demoCategoryItem, demoCategoryItem, demoCategoryItem, demoCategoryItem],
      onEntryClick: (id: string) => {alert(id)},
      onViewAllClick: () => {},
    },
    gettingStartedProps: {
      entries: [demoGettingStartedItem, demoGettingStartedItem, demoGettingStartedItem],
      onViewAllClick: () => {},
    }
  },
};
