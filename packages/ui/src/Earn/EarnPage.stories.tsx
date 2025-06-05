import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { EarnPage } from "./EarnPage";
import { Grid } from "@mui/material";

const meta: Meta<typeof EarnPage> = {
  title: "Earn/EarnPage",
  component: EarnPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof EarnPage>;

export const Default: Story = {
  render: () => <EarnPage />,
};

export const Loading: Story = {
  render: () => {
    // Use a wrapper component to set the loading state
    const LoadingEarnPage = () => {
      const EarnPageWithProps = EarnPage as any;
      return <EarnPageWithProps isLoadingOverride={true} />;
    };

    return <LoadingEarnPage />;
  },
};
