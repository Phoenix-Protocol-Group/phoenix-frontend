import React from "react";
import {
  Box,
  GlobalStyles,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PoolStats from "../PoolStats/PoolStats";
import LiquidityMining from "../LiquidityMining/LiquidityMining";
import StakingList from "../StakingList/StakingList";
import PoolLiquidity from "../PoolLiquidity/PoolLiquidity";
import { SidebarNavigation } from "../../SidebarNavigation/SidebarNavigation";
import { useState } from "react";
import MailIcon from "@mui/icons-material/Mail";
import { AppBar } from "../../AppBar/AppBar";
import { testTokens } from "../../Dashboard/WalletBalanceTable/WalletBalanceTable.stories";

const args = {
  poolStatArgs: {
    stats: [
      {
        title: "TVL",
        value: "$100,000.00",
      },
      {
        title: "My Share",
        value: "$0.00",
      },
      {
        title: "LP tokens",
        value: "0.00",
      },
      {
        title: "Swap fee",
        value: "0.3%",
      },
    ],
  },
  lpArgs: {
    rewards: [
      {
        name: "DAI",
        icon: "cryptoIcons/dai.svg",
        amount: 25,
        category: "Stable",
        usdValue: 1 * 25,
      },
      {
        name: "XLM",
        icon: "cryptoIcons/xlm.svg",
        amount: 200,
        category: "Non-Stable",
        usdValue: 0.85 * 200,
      },
    ],
    balance: 800,
  },
  stakingListArgs: {
    entries: [
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "3.5%",
        lockedPeriod: "1 day",
        amount: {
          tokenAmount: "10,000.5",
          tokenValueInUsd: "100,000.25",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "5.5%",
        lockedPeriod: "10 days",
        amount: {
          tokenAmount: "5,500.75",
          tokenValueInUsd: "55,000.50",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "7.5%",
        lockedPeriod: "20 days",
        amount: {
          tokenAmount: "2,250.25",
          tokenValueInUsd: "22,502.50",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "9.5%",
        lockedPeriod: "30 days",
        amount: {
          tokenAmount: "1,200.35",
          tokenValueInUsd: "12,003.75",
        },
        onClick: () => {
          // Empty function
        },
      },
      {
        icon: "cryptoIcons/btc.svg",
        title: "XLM/USDT",
        apr: "11.5%",
        lockedPeriod: "40 days",
        amount: {
          tokenAmount: "800.75",
          tokenValueInUsd: "8,007.50",
        },
        onClick: () => {
          // Empty function
        },
      },
      // Add more entries as needed
    ],
  },
  appBarArgs: {
    balance: 125.5,
    walletAddress: "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
    connectWallet: () => {},
    disconnectWallet: () => {},
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
  poolLiquidityArgs: {
    poolHistory: [
      [1687392000000, 152000],
      [1687478400000, 140400],
      [1687564800000, 160100],
      [1687651200000, 163300],
      [1687737600000, 150000],
      [1687824000000, 180000],
      [1687859473000, 200000],
    ],
    tokenA: testTokens[0],
    tokenB: testTokens[1],
    liquidityA: 10000,
    liquidityB: 20000,
    liquidityToken: testTokens[0],
    onAddLiquidity: () => {},
    onRemoveLiquidity: () => {},
  },
};

const overviewStyles = (
  <GlobalStyles
    styles={{
      body: { background: "linear-gradient(180deg, #1F2123 0%, #131517 100%)" },
    }}
  />
);

const Overview = () => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  const [navOpen, setNavOpen] = useState(largerThenMd ? true : false);

  return (
    <>
      {overviewStyles}
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
      <Box
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
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{ height: "2.5rem", width: "2.5rem" }}
              component="img"
              src="cryptoIcons/btc.svg"
            />
            <Box
              sx={{ ml: -1, height: "2.5rem", width: "2.5rem" }}
              component="img"
              src="cryptoIcons/usdc.svg"
            />
          </Box>
          <Typography sx={{ fontSize: "2rem", fontWeight: 700, ml: 1 }}>
            BTC-USDC
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2 }}>
              <PoolStats {...args.poolStatArgs} />
            </Box>
            <Box sx={{ mb: 4 }}>
              <LiquidityMining
                {...args.lpArgs}
                onClaimRewards={() => {}}
                onStake={() => {}}
                tokenName={"BTC/USDC"}
              />
            </Box>
            <StakingList {...args.stakingListArgs} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PoolLiquidity {...args.poolLiquidityArgs} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Overview;
