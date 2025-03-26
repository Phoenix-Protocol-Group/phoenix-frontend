import type { Meta, StoryObj } from "@storybook/react";
import PoolLiquidity from "./PoolLiquidity";
import { Grid } from "@mui/material";
import { testTokens } from "../../Dashboard/WalletBalanceTable/WalletBalanceTable.stories";
import React from "react";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof PoolLiquidity> = {
  title: "Pool/PoolLiquidity",
  // @ts-ignore
  component: PoolLiquidity,
  decorators: [
    (Story) => (
      <Grid container>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Grid item xs={12} md={5}>
          <Story />
        </Grid>
      </Grid>
    ),
  ],
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof PoolLiquidity>;

export const Primary: Story = {
  args: {
    poolHistory: [
      [1687392000000, 152000],
      [1687478400000, 140400],
      [1687564800000, 160100],
      [1687651200000, 163300],
      [1687737600000, 150000],
      [1687824000000, 180000],
      [1687859473000, 200000],
    ],
    tokenA: testTokens[0],
    tokenB: testTokens[1],
    liquidityA: 10000,
    liquidityB: 20000,
    liquidityToken: testTokens[0],
    onAddLiquidity: () => {},
    onRemoveLiquidity: () => {},
  },
};
