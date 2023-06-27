import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ConnectWallet from "./ConnectWallet";
import { freighter } from "@phoenix-protocol/state";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof ConnectWallet> = {
  title: "Components/ConnectWallet",
  // @ts-ignore
  component: ConnectWallet,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof ConnectWallet>;

export const Primary: Story = {
  args: {
    connectors: [freighter()],
    open: true,
    setOpen: () => {},
  },
};
