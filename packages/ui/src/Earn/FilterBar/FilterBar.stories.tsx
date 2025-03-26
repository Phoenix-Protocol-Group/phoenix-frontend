import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { FilterBar } from "./FilterBar";
import { Grid } from "@mui/material";

const meta: Meta<typeof FilterBar> = {
  title: "Earn/FilterBar",
  component: FilterBar,
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
    assetsFilter: { control: "select", options: ["Your assets", "All Assets"] },
    onAssetsFilterChange: { action: "assetsFilterChange" },
    typeFilter: { control: "select", options: ["All", "Type1", "Type2"] },
    onTypeFilterChange: { action: "typeFilterChange" },
    platformFilter: {
      control: "select",
      options: ["All", "Platform1", "Platform2"],
    },
    onPlatformFilterChange: { action: "platformFilterChange" },
    instantUnbondOnly: { control: "boolean" },
    onInstantUnbondOnlyChange: { action: "instantUnbondOnlyChange" },
    types: { control: "object", options: ["Type1", "Type2", "Type3"] },
    platforms: {
      control: "object",
      options: ["Platform1", "Platform2", "Platform3"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  args: {
    assetsFilter: "Your assets",
    typeFilter: "All",
    platformFilter: "All",
    instantUnbondOnly: false,
    types: ["Type1", "Type2", "Type3"],
    platforms: ["Platform1", "Platform2", "Platform3"],
  },
};
