import type { Meta, StoryObj } from "@storybook/react";
import LiquidityMining from "./LiquidityMining";
import { Grid } from "@mui/material";
import React from "react";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof LiquidityMining> = {
  title: "Pool/LiquidityMining",
  // @ts-ignore
  component: LiquidityMining,
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

const testTokens = [
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
];

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof LiquidityMining>;

export const Primary: Story = {
  args: {
    rewards: testTokens,
    balance: 800,
  },
};
