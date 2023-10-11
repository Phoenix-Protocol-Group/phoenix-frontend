import type { Meta, StoryObj } from "@storybook/react";
import TradeHistory from "./TradeHistory";
import { Grid } from "@mui/material";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof TradeHistory> = {
  title: "Swap/TradeHistory",
  // @ts-ignore
  component: TradeHistory,
  decorators: [
    (Story) => (
      <Grid container>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Grid item xs={12} md={7}>
          <Story />
        </Grid>
      </Grid>
    ),
  ],
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof TradeHistory>;
interface Token {
  name: string;
  symbol: string;
  icon: string;
}

interface Entry {
  fromToken: {
    token: Token;
    amount: string;
  };
  toToken: {
    token: Token;
    amount: string;
  };
  date: string;
  onClick: () => void;
  txHash: string;
}

const entries: Entry[] = [
  {
    date: "2021-10-10",
    fromToken: {
      token: {
        name: "USDT",
        symbol: "USDT",
        icon: "cryptoIcons/usdt.svg",
      },
      amount: "100",
    },
    toToken: {
      token: {
        name: "USDC",
        symbol: "USDC",
        icon: "cryptoIcons/usdc.svg",
      },
      amount: "100",
    },
    onClick: () => {
      // Empty function
    },
    txHash: "oiasnoisafasds",
  },
  {
    date: "2021-10-10",
    fromToken: {
      token: {
        name: "USDT",
        symbol: "USDT",
        icon: "cryptoIcons/usdt.svg",
      },
      amount: "100",
    },
    toToken: {
      token: {
        name: "USDC",
        symbol: "USDC",
        icon: "cryptoIcons/usdc.svg",
      },
      amount: "100",
    },
    onClick: () => {
      // Empty function
    },
    txHash: "oiasnoisafasds",
  },
  {
    date: "2021-10-10",
    fromToken: {
      token: {
        name: "USDT",
        symbol: "USDT",
        icon: "cryptoIcons/usdt.svg",
      },
      amount: "100",
    },
    toToken: {
      token: {
        name: "USDC",
        symbol: "USDC",
        icon: "cryptoIcons/usdc.svg",
      },
      amount: "100",
    },
    onClick: () => {
      // Empty function
    },
    txHash: "oiasnoisafasds",
  },
  // Add more entries as needed
];

export const Primary: Story = {
  args: {
    entries,
  },
};
