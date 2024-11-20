import type { Meta, StoryObj } from "@storybook/react";
import { BridgeContainer } from "./BridgeContainer";
import { Token } from "@phoenix-protocol/types";

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
const meta: Meta<typeof BridgeContainer> = {
  title: "Bridge/SwapContainer",
  // @ts-ignore
  component: BridgeContainer,
};
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
export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof BridgeContainer>;

export const Primary: Story = {
  args: {
    fromToken: fromToken,
    toToken: toToken,
    exchangeRate: "1 BTC = 26,567 USDT ($26,564)",
    networkFee: "0.0562 USDT (~$0.0562)",
    fromChain: {
      name: "Ethereum",
      icon: "chainIcons/ethereum.png",
      tokens: testTokens,
    },
    toChain: {
      name: "Stellar",
      icon: "chainIcons/stellar.png",
      tokens: testTokens,
    },
  },
};
