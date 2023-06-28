import { Box, Grid } from "@mui/material";
import { SidebarNavigation } from "../../SidebarNavigation/SidebarNavigation";
import { mockDataset } from "../DashboardCharts/mockdata";
import { testTokens } from "../WalletBalanceTable/WalletBalanceTable.stories";
import MainStats from "../MainStats/MainStats";
import DashboardPriceCharts from "../DashboardCharts/DashboardCharts";
import CryptoCTA from "../CryptoCTA/CryptoCTA";
import WalletBalanceTable from "../WalletBalanceTable/WalletBalanceTable";
import React from "react";
import MailIcon from "@mui/icons-material/Mail";

const args = {
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
  navItems: [
    {
      label: "Nav Item 1",
      icon: <MailIcon />,
      active: true,
      href: "#",
    },
    {
      label: "Nav Item 2",
      icon: <MailIcon />,
      active: false,
      href: "#",
    },
    {
      label: "Nav Item 3",
      icon: <MailIcon />,
      active: false,
      href: "#",
    },
    {
      label: "Nav Item 4",
      icon: <MailIcon />,
      active: false,
      href: "#",
    },
  ],
};

export default function Overview() {
  const [navOpen, setNavOpen] = React.useState(true);
  return (
    <>
      <SidebarNavigation
        onNavClick={() => {}}
        items={args.navItems}
        open={navOpen}
        setOpen={setNavOpen}
      />
      <Grid
        sx={{
          marginLeft: navOpen ? "240px" : "60px",
          width: navOpen ? "calc(100% - 240px)" : "calc(100% - 60px)",
          transition: "all 0.2s ease-in-out",
        }}
        container
        spacing={3}
      >
        <Grid item xs={12}>
          <MainStats {...args.mainstatsArgs} />
        </Grid>
        <Grid item xs={12} md={8}>
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
        <Grid item xs={6} md={2}>
          <DashboardPriceCharts {...args.dashboardArgs} />
        </Grid>
        <Grid item xs={6} md={2}>
          <DashboardPriceCharts {...args.dashboardArgs} />
        </Grid>
        <Grid item xs={12} md={4}>
          <CryptoCTA onClick={() => {}} />
        </Grid>
        <Grid item xs={12} md={8}>
          <WalletBalanceTable {...args.walletBalanceArgs} />
        </Grid>
      </Grid>
    </>
  );
}
