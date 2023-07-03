import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {SwapContainer} from "./SwapContainer";

const fromToken = {
  name: "USDT",
  icon: "cryptoIcons/usdt.svg",
  amount: 100,
  category: "Stable",
  usdValue: 1 * 100,
};

const toToken = {
  name: "USDT",
  icon: "cryptoIcons/usdt.svg",
  amount: 100,
  category: "Stable",
  usdValue: 1 * 100,
};

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof SwapContainer> = {
  title: "Components/SwapContainer",
  // @ts-ignore
  component: SwapContainer,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof SwapContainer>;

export const Primary: Story = {
  args: {
    fromToken: fromToken,
    toToken: toToken
  },
};
