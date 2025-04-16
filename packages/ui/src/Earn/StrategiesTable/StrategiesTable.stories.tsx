import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { StrategiesTable } from "./StrategiesTable";
import { Grid } from "@mui/material";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof StrategiesTable> = {
  title: "Earn/StrategiesTable",
  decorators: [
    (Story) => (
      <Grid container>
        <Grid item xs={12} md={8}>
          <Story />
        </Grid>
      </Grid>
    ),
  ],
  argTypes: {
    title: { control: "text" },
    strategies: { control: "object" },
    showFilters: { control: "boolean" },
    isLoading: { control: "boolean" },
    onViewDetails: { action: "viewDetails" },
  },
};

export default meta;

type Story = StoryObj<typeof StrategiesTable>;

const Template = (args: any) => <StrategiesTable {...args} />;

export const Default: Story = {
  render: Template,
  args: {
    title: "Discover Strategies",
    strategies: [
      {
        id: "stellar-yield-strategy",
        assets: [
          {
            name: "XLM",
            address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            icon: "/cryptoIcons/xlm.svg",
          },
        ],
        name: "Stellar Yield",
        description: "Stake XLM to earn PHO rewards",
        tvl: 123456,
        apr: 0.05,
        rewardToken: {
          name: "PHO",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/pho.svg",
        },
        unbondTime: 0,
        isMobile: false,
        link: "/earn/stellar-yield-strategy",
        category: "yield",
        providerId: "stellar",
      },
      {
        id: "phoenix-boost-strategy",
        isMobile: false,
        assets: [
          {
            name: "XLM",
            address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            icon: "/cryptoIcons/xlm.svg",
          },
        ],
        name: "Phoenix Boost",
        description: "Stake XLM to earn PHO rewards at a boosted rate",
        tvl: 789012,
        apr: 0.1,
        rewardToken: {
          name: "PHO",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/pho.svg",
        },
        unbondTime: 604800,
        link: "/earn/phoenix-boost-strategy",
        category: "staking",
        providerId: "phoenix",
      },
    ],
    showFilters: true,
    isLoading: false,
    onViewDetails: action("viewDetails"),
  },
};

export const WithUserData: Story = {
  render: Template,
  args: {
    title: "Your Strategies",
    strategies: [
      {
        id: "stellar-yield-strategy",
        assets: [
          {
            name: "XLM",
            address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            icon: "/cryptoIcons/xlm.svg",
          },
        ],
        name: "Stellar Yield",
        description: "Stake XLM to earn PHO rewards",
        tvl: 123456,
        apr: 0.05,
        rewardToken: {
          name: "PHO",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/pho.svg",
        },
        unbondTime: 0,
        isMobile: false,
        link: "/earn/stellar-yield-strategy",
        category: "yield",
        providerId: "stellar",
        hasJoined: true,
        userStake: 1000,
        userRewards: 25.5,
      },
      {
        id: "phoenix-boost-strategy",
        isMobile: false,
        assets: [
          {
            name: "XLM",
            address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            icon: "/cryptoIcons/xlm.svg",
          },
        ],
        name: "Phoenix Boost",
        description: "Stake XLM to earn PHO rewards at a boosted rate",
        tvl: 789012,
        apr: 0.1,
        rewardToken: {
          name: "PHO",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/pho.svg",
        },
        unbondTime: 604800,
        link: "/earn/phoenix-boost-strategy",
        category: "staking",
        providerId: "phoenix",
        hasJoined: true,
        userStake: 5000,
        userRewards: 75.25,
      },
    ],
    showFilters: false,
    isLoading: false,
    onViewDetails: action("viewDetails"),
  },
};

export const Loading: Story = {
  render: Template,
  args: {
    title: "Discover Strategies",
    strategies: [],
    showFilters: true,
    isLoading: true,
    onViewDetails: action("viewDetails"),
  },
};

export const Empty: Story = {
  render: Template,
  args: {
    title: "Your Strategies",
    strategies: [],
    showFilters: false,
    isLoading: false,
    onViewDetails: action("viewDetails"),
  },
};
