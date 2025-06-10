import type { Meta, StoryObj } from "@storybook/react";
import { TransactionsCards } from "./TransactionsCards";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof TransactionsCards> = {
  title: "Transactions/TransactionsCards",
  component: TransactionsCards,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof TransactionsCards>;

export const Primary: Story = {
  args: {
    activeTraders: "12 370",
    totalTraders: "420 690",
    mostTradedAsset: {
      name: "USDT",
      icon: "cryptoIcons/usdt.svg",
      amount: 100,
      category: "Stable",
      usdValue: 1 * 100,
      contractId: "",
    },
  },
};
