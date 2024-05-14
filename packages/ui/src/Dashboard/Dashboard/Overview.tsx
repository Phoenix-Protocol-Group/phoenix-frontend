import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import { SidebarNavigation } from "../../SidebarNavigation/SidebarNavigation";
import { mockDataset } from "../DashboardCharts/mockdata";
import { testTokens } from "../WalletBalanceTable/WalletBalanceTable.stories";
import MainStats from "../MainStats/MainStats";
import DashboardPriceCharts from "../DashboardCharts/DashboardCharts";
import CryptoCTA from "../CryptoCTA/CryptoCTA";
import WalletBalanceTable from "../WalletBalanceTable/WalletBalanceTable";
import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import { AppBar } from "../../AppBar/AppBar";
import DashBoardStats from "../DashboardStats/DashboardStats";

const stellarGainerAsset = {
  name: "Stellar",
  symbol: "XLM",
  price: "$3.00",
  change: 22.5,
  icon: "/cryptoIcons/xlm.svg",
  volume: "$100,000",
};

const usdcLoserAsset = {
  name: "USDC",
  symbol: "USDC",
  price: "$1",
  change: -0.8,
  icon: "/cryptoIcons/usdc.svg",
  volume: "$100,000",
};

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
  dashboardStatsArgs: {
    gainer: stellarGainerAsset,
    loser: usdcLoserAsset,
    availableAssets: "$100,000",
    lockedAssets: "$100,000",
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
        }}
        container
        spacing={largerThenMd ? 3 : 1}
      >
        <Grid item xs={12}>
          <MainStats {...args.mainstatsArgs} />
        </Grid>
        <Grid item xs={12} md={8} mt={!largerThenMd ? 2 : undefined}>
          <DashBoardStats {...args.dashboardStatsArgs} />
        </Grid>
        <Grid item xs={6} md={2} mt={!largerThenMd ? 2 : undefined}>
          <DashboardPriceCharts {...args.dashboardArgs} />
        </Grid>
        <Grid item xs={6} md={2} mt={!largerThenMd ? 2 : undefined}>
          <DashboardPriceCharts {...args.dashboardArgs} />
        </Grid>
        <Grid item xs={12} md={4} mt={!largerThenMd ? 4 : undefined}>
          <CryptoCTA onClick={() => {}} />
        </Grid>
        <Grid item xs={12} md={8} mt={!largerThenMd ? 2 : undefined}>
          {/* @ts-ignore */}
          <WalletBalanceTable {...args.walletBalanceArgs} />
        </Grid>
      </Grid>
    </>
  );
}
