import type { Meta, StoryObj } from "@storybook/react";
import { BridgeAssetSelector } from "./BridgeAssetSelector";
import { Token } from "@phoenix-protocol/types";

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
const meta: Meta<typeof BridgeAssetSelector> = {
  title: "Bridge/AssetSelector",
  // @ts-ignore
  component: BridgeAssetSelector,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof BridgeAssetSelector>;

export const Primary: Story = {
  args: {
    chains: [
      {
        name: "Ethereum",
        icon: "chainIcons/ethereum.png",
        tokens: testTokens,
      },
      {
        name: "Stellar",
        icon: "chainIcons/stellar.png",
        tokens: [...testTokens, ...testTokens],
      },
    ],
  },
};
