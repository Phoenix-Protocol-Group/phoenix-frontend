import type { Meta, StoryObj } from "@storybook/react";
import NftListing from "./NftListing";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof NftListing> = {
  title: "Marketplace/Shared/NftListing",
  // @ts-ignore
  component: NftListing,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof NftListing>;

const demoEntry = {
  id: "2137",
  image: "/nftPreview.png",
  collectionName: "Collection Name",
  nftName: "NFT Name",
  price: "0.00",
  ownedBy: "You",
};

export const Primary: Story = {
  args: {
    searchTerm: "",
    setSearchTerm: (searchTerm) => {},
    order: "asc",
    orderItems: [
      {
        label: "Lowest Listing Price",
        value: "asc",
      },
      {
        label: "Highest Listing Price",
        value: "desc",
      },
    ],
    activeCurrency: "crypto",
    setActiveCurrency: (currency: any) => {
      alert(currency);
    },
    nftEntries: [
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
    ],
    minPrice: "0",
    setMinPrice: (minPrice: string) => {},
    maxPrice: "0",
    setMaxPrice: (maxPrice: string) => {},
    status: "ALL",
    setStatus: (status: any) => {
      alert(status);
    },
    type: "ALL",
    setType: (type: any) => {
      alert(type);
    },
  },
};

export const ListForSale: Story = {
  args: {
    listForSaleClick: (id: string) => {
      alert(id);
    },
    searchTerm: "",
    setSearchTerm: (searchTerm) => {},
    order: "asc",
    orderItems: [
      {
        label: "Lowest Listing Price",
        value: "asc",
      },
      {
        label: "Highest Listing Price",
        value: "desc",
      },
    ],
    activeCurrency: "crypto",
    setActiveCurrency: (currency: any) => {
      alert(currency);
    },
    nftEntries: [
      {
        listForSale: true,
        id: "2137",
        image: "/nftPreview.png",
        collectionName: "Collection Name",
        nftName: "NFT Name",
        price: "0.00",
        ownedBy: "You",
      },
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
      demoEntry,
    ],
    minPrice: "0",
    setMinPrice: (minPrice: string) => {},
    maxPrice: "0",
    setMaxPrice: (maxPrice: string) => {},
    status: "ALL",
    setStatus: (status: any) => {
      alert(status);
    },
    type: "ALL",
    setType: (type: any) => {
      alert(type);
    },
  },
};
