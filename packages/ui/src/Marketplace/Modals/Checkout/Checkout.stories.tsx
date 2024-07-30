import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Checkout from "./Checkout";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Checkout> = {
  title: "Marketplace/Modals/Checkout",
  // @ts-ignore
  component: Checkout,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Checkout>;

export const Primary: Story = {
  args: {
    open: true,
    onClose: () => {},
    nftName: "NFT Name",
    price: "2000",
    priceUsd: "1000",
    collectionName: "Collection Name",
    quantity: "1",
    phoenixFee: "7.5",
    bestOffer: "24690",
  },
};
