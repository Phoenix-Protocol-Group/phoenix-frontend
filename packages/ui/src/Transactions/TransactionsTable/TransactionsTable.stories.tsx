import type { Meta, StoryObj } from "@storybook/react";
import { TransactionsTable } from "./TransactionsTable";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof TransactionsTable> = {
  title: "Transactions/TransactionsTable",
  component: TransactionsTable
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

export const Primary: Story = {
  args: {
    entries: [{
      type: "Success",
      assets: [asset, asset],
      tradeSize: "1000",
      tradeValue: "2000",
      date: "1.1.2024",
      txHash: "0x1234567890",
    }, {
      type: "Failed",
      assets: [asset, asset],
      tradeSize: "1000",
      tradeValue: "2000",
      date: "1.1.2024",
      txHash: "0x1234567890",
    }]
  },
};
