import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import MakeOffer from "./MakeOffer";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof MakeOffer> = {
  title: "Marketplace/Modals/MakeOffer",
  // @ts-ignore
  component: MakeOffer,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof MakeOffer>;

export const Primary: Story = {
  args: {
    open: true,
    onClose: () => {},
    nftName: "NFT Name",
    price: "2000",
    priceUsd: "1000",
    collectionName: "Collection Name",
    balance: "15012",
    floorPrice: "20128",
    bestOffer: "24690",
    duration: "7",
  },
};
