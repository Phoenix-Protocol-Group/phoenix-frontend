import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {Modal} from "./Modal";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Modal> = {
  title: "General/Modal",
  // @ts-ignore
  component: Modal,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Modal>;

export const Primary: Story = {
  args: {
    open: true,
    type: "SUCCESS",
    description: "You don’t have enough assets in your wallet",
    setOpen: () => {},
  },
};

export const Secondary: Story = {
  args: {
    open: true,
    type: "SUCCESS",
    setOpen: () => {},
    tokens: [{
      name: "USDT",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1 * 100,
    }, {
      name: "USDC",
      icon: "cryptoIcons/usdc.svg",
      amount: 50,
      category: "Stable",
      usdValue: 1 * 50,
    }]
  },
};
