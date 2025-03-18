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

const entry = {
  fromAsset: {
    name: "XLM",
    address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
    icon: "/cryptoIcons/xlm.svg",
  },
  toAsset: {
    name: "USDC",
    address: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
    icon: "/cryptoIcons/usdc.svg",
  },
  fromAmount: 22,
  toAmount: 5.9936094,
  tradeValue: "5.99",
  date: 1742238985000,
  txHash: "241358169691193344",
};

export const Primary: Story = {
  args: {
    activeSort: { column: "tradeSize", direction: "asc" },
    activeFilters: {
      dateRange: { from: null, to: null },
      tradeSize: { from: null, to: null },
      tradeValue: { from: null, to: null },
    },
    entries: [entry, entry, entry, entry, entry],
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
