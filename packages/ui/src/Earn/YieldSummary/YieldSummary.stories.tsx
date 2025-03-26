import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { YieldSummary } from "./YieldSummary";
import { Grid } from "@mui/material";

const meta: Meta<typeof YieldSummary> = {
  title: "Earn/YieldSummary",
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
    totalValue: { control: "number" },
    claimableRewards: { control: "number" },
    onClaimAll: { action: "clicked" },
  },
};

export default meta;

type Story = StoryObj<typeof YieldSummary>;

const Template = (args: any) => <YieldSummary {...args} />;

export const Default: Story = {
  render: Template,
  args: {
    totalValue: 12345.67,
    claimableRewards: 123.45,
  },
};
