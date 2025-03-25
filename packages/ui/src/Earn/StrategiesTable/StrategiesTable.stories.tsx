import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { StrategiesTable } from "./StrategiesTable";
import { Grid } from "@mui/material";

const meta: Meta<typeof StrategiesTable> = {
  title: "Earn/StrategiesTable",
  decorators: [
    (Story) => (
      <Grid container>
        <Grid item xs={12} md={7}>
          <Story />
        </Grid>
      </Grid>
    ),
  ],
  argTypes: {
    title: { control: "text" },
    strategies: { control: "object" },
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
        assets: [
          {
            name: "XLM",
            address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            icon: "/cryptoIcons/xlm.svg",
          },
        ],
        name: "Stellar Yield",
        tvl: 123456,
        apr: 0.05,
        rewardToken: {
          name: "PHO",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/pho.svg",
        },
        unbondTime: "Instant",
      },
      {
        assets: [
          {
            name: "XLM",
            address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
            icon: "/cryptoIcons/xlm.svg",
          },
        ],
        name: "Phoenix Boost",
        tvl: 789012,
        apr: 0.1,
        rewardToken: {
          name: "PHO",
          address: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
          icon: "/cryptoIcons/pho.svg",
        },
        unbondTime: "7 Days",
      },
    ],
  },
};
