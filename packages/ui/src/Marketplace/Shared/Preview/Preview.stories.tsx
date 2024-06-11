import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Preview from "./Preview";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Preview> = {
  title: "Marketplace/Shared/Preview",
  // @ts-ignore
  component: Preview,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Preview>;

export const Primary: Story = {
  args: {
    image: "/nftPreview.png",
    collectionName: "Collection Name",
    nftName: "NFT Name",
    price: "0.00",
    ownedBy: "You"
  },
  parameters: {
    layout: "centered"
  }
};
