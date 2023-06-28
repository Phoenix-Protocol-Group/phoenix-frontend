import type { Meta, StoryObj } from "@storybook/react";
import Overview from "./Overview";
import { Box, Grid } from "@mui/material";
import MainStats from "../MainStats/MainStats";
import { mockDataset } from "../DashboardCharts/DashboardCharts.stories";
import DashboardPriceCharts from "../DashboardCharts/DashboardCharts";
import CryptoCTA from "../CryptoCTA/CryptoCTA";
import WalletBalanceTable from "../WalletBalanceTable/WalletBalanceTable";
import { testTokens } from "../WalletBalanceTable/WalletBalanceTable.stories";

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
  args: {
    mainstatsArgs: {
      stats: [
        {
          title: "Total Assets",
          value: "$100,000",
          link: "https://google.com",
        },
        {
          title: "Total Rewards",
          value: "$100,000",
          link: "https://google.com",
        },
        {
          title: "Staked Phoenix",
          value: "$100,000",
          link: "https://google.com",
        },
      ],
    },
    dashboardArgs: {
      data: mockDataset,
      icon: {
        small: "image-103.png",
        large: "image-stellar.png",
      },
      assetName: "XLM",
    },
    walletBalanceArgs: {
      tokens: testTokens,
    },
  },
  render: (args: any) => (
    // The grid is a component that allows us to
    // easily organize the layout of our UI
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <MainStats {...args.mainstatsArgs} />
      </Grid>
      <Grid item xs={8}>
        <Box
          sx={{
            border: "1px solid #E5E5E5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          Coming soon
        </Box>
      </Grid>
      <Grid item xs={2}>
        <DashboardPriceCharts {...args.dashboardArgs} />
      </Grid>
      <Grid item xs={2}>
        <DashboardPriceCharts {...args.dashboardArgs} />
      </Grid>
      <Grid item xs={4}>
        <CryptoCTA onClick={() => {}} />
      </Grid>
      <Grid item xs={8}>
        <WalletBalanceTable {...args.walletBalanceArgs} />
      </Grid>
    </Grid>
  ),
};
