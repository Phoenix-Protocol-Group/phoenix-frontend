import type { Meta, StoryObj } from "@storybook/react";
import StakingList from "./StakingList";
import { Grid } from "@mui/material";
import { StakingListEntry as Entry } from "@phoenix-protocol/types";
import React from "react";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof StakingList> = {
  title: "Pool/StakingList",
  // @ts-ignore
  component: StakingList,
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
type Story = StoryObj<typeof StakingList>;

const entries = [
  {
    icon: "cryptoIcons/btc.svg",
    title: "XLM/USDT",
    apr: "3.5%",
    lockedPeriod: "1 day",
    amount: {
      tokenAmount: "10,000.5",
      tokenValueInUsd: "100,000.25",
    },
    onClick: () => {
      // Empty function
    },
  },
  {
    icon: "cryptoIcons/btc.svg",
    title: "XLM/USDT",
    apr: "5.5%",
    lockedPeriod: "10 days",
    amount: {
      tokenAmount: "5,500.75",
      tokenValueInUsd: "55,000.50",
    },
    onClick: () => {
      // Empty function
    },
  },
  {
    icon: "cryptoIcons/btc.svg",
    title: "XLM/USDT",
    apr: "7.5%",
    lockedPeriod: "20 days",
    amount: {
      tokenAmount: "2,250.25",
      tokenValueInUsd: "22,502.50",
    },
    onClick: () => {
      // Empty function
    },
  },
  {
    icon: "cryptoIcons/btc.svg",
    title: "XLM/USDT",
    apr: "9.5%",
    lockedPeriod: "30 days",
    amount: {
      tokenAmount: "1,200.35",
      tokenValueInUsd: "12,003.75",
    },
    onClick: () => {
      // Empty function
    },
  },
  {
    icon: "cryptoIcons/btc.svg",
    title: "XLM/USDT",
    apr: "11.5%",
    lockedPeriod: "40 days",
    amount: {
      tokenAmount: "800.75",
      tokenValueInUsd: "8,007.50",
    },
    onClick: () => {
      // Empty function
    },
  },
  // Add more entries as needed
];

export const Primary: Story = {
  args: {
    entries: entries as Entry[],
  },
};

export const NoEntries: Story = {
  args: {
    entries: [],
  },
};
