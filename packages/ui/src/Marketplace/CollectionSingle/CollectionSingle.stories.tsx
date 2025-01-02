import type { Meta, StoryObj } from "@storybook/react";
import CollectionSingle from "./CollectionSingle";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof CollectionSingle> = {
  title: "Marketplace/CollectionSingle",
  // @ts-ignore
  component: CollectionSingle,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof CollectionSingle>;

const demoEntry = {
  id: "2137",
  image: "/nftPreview.png",
  collectionName: "Collection Name",
  nftName: "NFT Name",
  price: "0.00",
  ownedBy: "You"
}

export const Primary: Story = {
  args: {
    name: "Collection Name",
    creator: "GARX7YOCGEIOA5YQXCHA6ZM7764KLCFRVTTQJQZMPLJPCZKHY4KATVM3",
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    likes: 300,
    floorPrice: "20.9K",
    bestOffer: "19.1K",
    volume7d: "7.47M",
    owners: "1785",
    forSale: "675",
    total: "2610",
    royalities: "3.14%",
    nftEntries: [demoEntry, demoEntry, demoEntry],
    searchTerm: "",
    setSearchTerm: (searchTerm) => {},
    order: "asc",
    orderItems: [{
      label: "Lowest Listing Price",
      value: "asc"
    }, {
      label: "Highest Listing Price",
      value: "desc"
    }],
    activeCurrency: "crypto",
    setActiveCurrency: (currency: any) => {alert(currency)},
    minPrice: "0",
    setMinPrice: (minPrice: string) => {},
    maxPrice: "0",
    setMaxPrice: (maxPrice: string) => {},
    status: "ALL",
    setStatus: (status: any) => {alert(status)},
    type: "ALL",
    setType: (type: any) => {alert(type)},
  },
};

