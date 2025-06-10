import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SwapPage } from "./SwapPage";

const token = {
  name: "USDT",
  icon: "cryptoIcons/usdt.svg",
  amount: 100,
  category: "Stable",
  usdValue: 1 * 100,
  contractId: "",
};

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof SwapPage> = {
  title: "Swap/SwapPage",
  // @ts-ignore
  component: SwapPage,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof SwapPage>;

export const Primary: Story = {
  args: {},
};
