import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import { SidebarNavigation } from "../../SidebarNavigation/SidebarNavigation";
import { mockDataset } from "../DashboardCharts/mockdata";
import { testTokens } from "../WalletBalanceTable/WalletBalanceTable.stories";
import DashboardPriceCharts from "../DashboardCharts/DashboardCharts";
import CryptoCTA from "../CryptoCTA/CryptoCTA";
import WalletBalanceTable from "../WalletBalanceTable/WalletBalanceTable";
import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import { AppBar } from "../../AppBar/AppBar";

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
  appBarArgs: {
    balance: 125.5,
    walletAddress: "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
    connectWallet: () => {},
    disconnectWallet: () => {},
  },
};

export default function Overview() {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  const [navOpen, setNavOpen] = React.useState(largerThenMd ? true : false);
  return (
    <>
      <SidebarNavigation
        onNavClick={() => {}}
        items={args.navItems}
        open={navOpen}
        setOpen={setNavOpen}
      />
      <AppBar
        mobileNavOpen={navOpen}
        toggleMobileNav={(open) => setNavOpen(open)}
        {...args.appBarArgs}
      />
      <Grid
        sx={{
          marginLeft: largerThenMd
            ? navOpen
              ? "240px"
              : "60px"
            : navOpen
            ? "240px"
            : "0",
          width: largerThenMd
            ? navOpen
              ? "calc(100% - 240px)"
              : "calc(100% - 60px)"
            : navOpen
            ? "0"
            : "100%",
          transition: "all 0.2s ease-in-out",
          mt: { xs: "70px", md: 5 },
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 2, sm: 3, md: 4 },
        }}
        container
        spacing={largerThenMd ? 3 : 1}
      >
        <Grid item container md={9} spacing={3}>
          <Grid item xs={6} md={6} mt={!largerThenMd ? 2 : undefined}>
            <DashboardPriceCharts {...args.dashboardArgs} />
          </Grid>
          <Grid item xs={6} md={6} mt={!largerThenMd ? 2 : undefined}>
            <DashboardPriceCharts {...args.dashboardArgs} />
          </Grid>

          <Grid item xs={12} md={12} mt={!largerThenMd ? 2 : undefined}>
            {/* @ts-ignore */}
            <WalletBalanceTable {...args.walletBalanceArgs} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={3} mt={!largerThenMd ? 4 : undefined}>
          <CryptoCTA onClick={() => {}} />
        </Grid>
      </Grid>
    </>
  );
}
