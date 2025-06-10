import type { Meta, StoryObj } from "@storybook/react";
import WalletBalanceTable from "./WalletBalanceTable";
import { Grid } from "@mui/material";
import React from "react";
import { contract } from "@stellar/stellar-sdk";

export const testTokens = [
  {
    name: "USDT",
    icon: "cryptoIcons/usdt.svg",
    amount: 100,
    category: "Stable",
    usdValue: 1 * 100,
    contractId: "usdt-token",
  },
  {
    name: "USDC",
    icon: "cryptoIcons/usdc.svg",
    amount: 50,
    category: "Stable",
    usdValue: 1 * 50,
    contractId: "usdt-token",
  },
  {
    name: "DAI",
    icon: "cryptoIcons/dai.svg",
    amount: 25,
    category: "Stable",
    usdValue: 1 * 25,
    contractId: "usdt-token",
  },
  {
    name: "XLM",
    icon: "cryptoIcons/xlm.svg",
    amount: 200,
    category: "Non-Stable",
    usdValue: 0.85 * 200,
    contractId: "usdt-token",
  },
  {
    name: "BTC",
    icon: "cryptoIcons/btc.svg",
    amount: 0.5,
    category: "Non-Stable",
    usdValue: 30000 * 0.5,
    contractId: "usdt-token",
  },
];

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof WalletBalanceTable> = {
  title: "Dashboard/WalletBalanceTable",
  // @ts-ignore
  component: WalletBalanceTable,
  decorators: [
    (Story) => (
      <Grid container gap={3} style={{ margin: "3em" }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Grid item xs={9}>
          <Story />
        </Grid>
      </Grid>
    ),
  ],
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof WalletBalanceTable>;

export const Primary: Story = {
  args: {
    // @ts-ignore
    tokens: testTokens,
    onTokenClick: (token) => console.log(token),
  },
};

export const NoEntries: Story = {
  args: {
    // @ts-ignore
    tokens: [],
    onTokenClick: (token) => console.log(token),
  },
};
