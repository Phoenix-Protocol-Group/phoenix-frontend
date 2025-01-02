import type { Meta, StoryObj } from "@storybook/react";
import NftSingle from "./NftSingle";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof NftSingle> = {
  title: "Marketplace/NftSingle",
  // @ts-ignore
  component: NftSingle,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof NftSingle>;

const now = new Date();

export const Primary: Story = {
  args: {
    previewImage: "/demo_nft.png",
    collectionName: "Collection Name",
    nftName: "NFT Name",
    nftDescription: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    lastSale: "103.1K PHO",
    bestOffer: "162.5K PHO",
    floorPrice: "177.89K PHO",
    owner: "GARX7YOCGEIOA5YQXCHA6ZM7764KLCFRVTTQJQZMPLJPCZKHY4KATVM3",
    auctionEnds: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 45 * 60 * 1000 + 30 * 1000),
    availableSupply: "1",
    totalSupply: "20",
    price: "150,68K PHO",
    priceUsd: "2,407.04"
  },
};

export const ListForSale: Story = {
  args: {
    listForSale: true,
    previewImage: "/demo_nft.png",
    collectionName: "Collection Name",
    nftName: "NFT Name",
    nftDescription: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    lastSale: "103.1K PHO",
    bestOffer: "162.5K PHO",
    floorPrice: "177.89K PHO",
    owner: "GARX7YOCGEIOA5YQXCHA6ZM7764KLCFRVTTQJQZMPLJPCZKHY4KATVM3",
    auctionEnds: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 45 * 60 * 1000 + 30 * 1000),
    availableSupply: "1",
    totalSupply: "20",
    price: "150,68K PHO",
    priceUsd: "2,407.04"
  },
};

