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

export const PoolSuccess: Story = {
  args: {
    open: true,
    type: "SUCCESS",
    setOpen: () => {},
    tokenTitles: [
      "Token A:",
      "Token B:"
    ],
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
    }],
    onButtonClick: () => {}
  },
};

export const SwapSuccess: Story = {
  args: {
    open: true,
    type: "SUCCESS",
    setOpen: () => {},
    tokenTitles: [
      "From:",
      "To:"
    ],
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
    }],
    onButtonClick: () => {}
  },
};

export const TokenSingle: Story = {
  args: {
    open: true,
    type: "SUCCESS",
    setOpen: () => {},
    tokenTitles: [
      "Provided Token:",
    ],
    tokens: [{
      name: "USDT",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1 * 100,
    }],
    onButtonClick: () => {}
  },
};

export const Error: Story = {
  args: {
    open: true,
    type: "ERROR",
    setOpen: () => {},
    description: "There is a problem",
    error: "foo"
  },
};
