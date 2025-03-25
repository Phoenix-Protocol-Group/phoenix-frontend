import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { EarnPage } from "./EarnPage";
import { Grid } from "@mui/material";

const meta: Meta<typeof EarnPage> = {
  title: "Earn/EarnPage",
  component: EarnPage,
};

export default meta;

type Story = StoryObj<typeof EarnPage>;

export const Default: Story = {
  render: () => <EarnPage />,
};
