import type { Meta, StoryObj } from "@storybook/react";
import { AppBar } from "./AppBar";
import React from "react";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof AppBar> = {
  title: "Layout/AppBar",
  component: AppBar,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof AppBar>;

export const Connected: Story = {
  args: {
    balance: 125.5,
    walletAddress: "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
    connectWallet: () => {},
    disconnectWallet: () => {},
  },
};

export const Unconnected: Story = {
  args: {
    balance: undefined,
    walletAddress: undefined,
    connectWallet: () => {},
    disconnectWallet: () => {},
  },
};
