import type { Meta, StoryObj } from "@storybook/react";
import { TransactionsTable } from "./TransactionsTable";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof TransactionsTable> = {
  title: "Transactions/TransactionsTable",
  component: TransactionsTable,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof TransactionsTable>;

const asset = {
  name: "USDT",
  icon: "cryptoIcons/usdt.svg",
  amount: 100,
  category: "Stable",
  usdValue: 1 * 100,
};

const assetB = {
  name: "USDC",
  icon: "cryptoIcons/usdc.svg",
  amount: 200,
  category: "Stable",
  usdValue: 1 * 200,
};

export const Primary: Story = {
  args: {
    activeSort: { column: "tradeSize", direction: "asc" },
    activeFilters: {
      dateRange: { from: null, to: null },
      tradeSize: { from: null, to: null },
      tradeValue: { from: null, to: null },
    },
    entries: [
      {
        type: "Buy",
        assets: [assetB, asset],
        tradeSize: "1000",
        tradeValue: "2000",
        date: "1.1.2024",
        txHash: "0x1234567890",
      },
      {
        type: "Sell",
        assets: [assetB, asset],
        tradeSize: "1000",
        tradeValue: "2000",
        date: "1.1.2024",
        txHash: "0x1234567890",
      },
    ],
  },
};

export const NoEntries: Story = {
  args: {
    activeSort: { column: "tradeSize", direction: "asc" },
    activeView: "personal",
    activeFilters: {
      dateRange: { from: null, to: null },
      tradeSize: { from: null, to: null },
      tradeValue: { from: null, to: null },
    },
    entries: [],
  },
};
