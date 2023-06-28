import type { Meta, StoryObj } from "@storybook/react";
import Overview from "./Overview";
import { Box, Grid } from "@mui/material";
import MainStats from "../MainStats/MainStats";
import { mockDataset } from "../DashboardCharts/mockdata";
import DashboardPriceCharts from "../DashboardCharts/DashboardCharts";
import CryptoCTA from "../CryptoCTA/CryptoCTA";
import WalletBalanceTable from "../WalletBalanceTable/WalletBalanceTable";
import { testTokens } from "../WalletBalanceTable/WalletBalanceTable.stories";
import { SidebarNavigation } from "../../SidebarNavigation/SidebarNavigation";

// Default metadata of the story https://storybook.js.org/docs/react/api/csf#default-export
const meta: Meta<typeof Overview> = {
  title: "Dashboard/Overview",
  // @ts-ignore
  component: Overview,
};

export default meta;

// The story type for the component https://storybook.js.org/docs/react/api/csf#named-story-exports
type Story = StoryObj<typeof Overview>;

export const Dashboard: Story = {
  // This is the data that will be used by the component

  render: (args: any) => (
    <>
      <Overview />
    </>
  ),
};
