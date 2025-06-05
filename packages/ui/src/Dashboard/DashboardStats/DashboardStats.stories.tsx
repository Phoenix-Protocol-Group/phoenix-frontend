import type { Meta, StoryObj } from "@storybook/react";
import DashboardStats from "./DashboardStats";
import { Grid } from "@mui/material";
import React from "react";

const stellarGainerAsset = {
  name: "Stellar",
  symbol: "XLM",
  price: "$3.00",
  change: 22.5,
  icon: "/cryptoIcons/xlm.svg",
  volume: "$100,000",
};

const usdcLoserAsset = {
  name: "USDC",
  symbol: "USDC",
  price: "$1",
  change: -0.8,
  icon: "/cryptoIcons/usdc.svg",
  volume: "$100,000",
};

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof DashboardStats> = {
  title: "Dashboard/DashboardStats",
  // @ts-ignore
  component: DashboardStats,
  decorators: [
    (Story) => (
      <Grid container gap={3} sx={{ margin: { md: "3rem" } }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}

        <Story />
      </Grid>
    ),
  ],
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof DashboardStats>;

export const Main: Story = {
  args: {
    gainer: stellarGainerAsset,
    loser: usdcLoserAsset,
    availableAssets: "$100,000",
    lockedAssets: "$100,000",
  },
  render: (args) => (
    <Grid item xs={12} md={8}>
      <DashboardStats {...args} />
    </Grid>
  ),
};

export const Loading: Story = {
  args: {},
  render: (args) => (
    <Grid item xs={12} md={8}>
      <DashboardStats {...args} />
    </Grid>
  ),
};
