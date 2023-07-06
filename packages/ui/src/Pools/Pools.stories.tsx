import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pools, Token, Pool } from "./Pools";

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
  }
];

const testPool: Pool = {
  tokens: testTokens,
  tvl: "$29,573.57",
  maxApr: "98.65%",
  userLiquidity: 30
}

const pools: Pool[] = [testPool, testPool, testPool, testPool, testPool, testPool, testPool, testPool, testPool, testPool, testPool, testPool, testPool];


// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Pools> = {
  title: "General/Pools",
  component: Pools
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Pools>;

export const Primary: Story = {
  args: {
    pools: pools,
    filter: "ALL"
  },
};

export const Secondary: Story = {
  args: {
    pools: pools,
    filter: "MY"
  },
};
