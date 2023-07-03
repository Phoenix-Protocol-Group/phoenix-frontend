import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {AssetSelector} from "./AssetSelector";
import { Token } from "./AssetSelector";

const testTokens: Token[] = [
  {
    name: "USDT",
    icon: "cryptoIcons/usdt.svg",
    amount: 100,
    category: "Stable",
    usdValue: 1 * 100,
  },
  {
    name: "USDC",
    icon: "cryptoIcons/usdc.svg",
    amount: 50,
    category: "Stable",
    usdValue: 1 * 50,
  },
  {
    name: "DAI",
    icon: "cryptoIcons/dai.svg",
    amount: 25,
    category: "Stable",
    usdValue: 1 * 25,
  },
  {
    name: "XLM",
    icon: "cryptoIcons/xlm.svg",
    amount: 200,
    category: "Non-Stable",
    usdValue: 0.85 * 200,
  },
  {
    name: "BTC",
    icon: "cryptoIcons/btc.svg",
    amount: 0.5,
    category: "Non-Stable",
    usdValue: 30000 * 0.5,
  },
];


// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof AssetSelector> = {
  title: "Swap/AssetSelector",
  // @ts-ignore
  component: AssetSelector,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof AssetSelector>;

export const Primary: Story = {
  args: {
    tokens: testTokens,
    tokensAll: [...testTokens, ...testTokens, ...testTokens]
  },
};
