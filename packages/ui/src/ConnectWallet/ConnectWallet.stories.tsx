import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ConnectWallet } from "./ConnectWallet";
import { freighter } from "@phoenix-protocol/state";
import { hana } from "@phoenix-protocol/state";
import { lobstr } from "@phoenix-protocol/state";
import { xbull } from "@phoenix-protocol/state";
import { WalletConnect } from "@phoenix-protocol/state";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof ConnectWallet> = {
  title: "General/ConnectWalletModal",
  // @ts-ignore
  component: ConnectWallet,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof ConnectWallet>;

export const Primary: Story = {
  args: {
    connectors: [
      freighter(),
      xbull(),
      lobstr(),
      hana(),
      new WalletConnect(true),
    ],
    open: true,
    setOpen: () => {},
    // Mock connect function with 500ms delay
    connect: async (connector: any) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};
