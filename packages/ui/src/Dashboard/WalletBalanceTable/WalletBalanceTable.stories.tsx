import type { Meta, StoryObj } from "@storybook/react";
import WalletBalanceTable from "./WalletBalanceTable";
import { Grid } from "@mui/material";

export const testTokens = [
  {
    name: "PHO",
    icon: "cryptoIcons/pho.svg",
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
