import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Pool, Pools } from "../Pools/Pools";
import { Token } from "../Modal/Modal";
import MailIcon from "@mui/icons-material/Mail";
import React from "react";
import { SidebarNavigation } from "../SidebarNavigation/SidebarNavigation";
import { AppBar } from "../AppBar/AppBar";

const testTokens: Token[] = [
  {
    name: "USDT",
    icon: "cryptoIcons/usdt.svg",
    amount: 100,
    category: "Stable",
    usdValue: 1 * 100,
  },
  {
    name: "USDC",
    icon: "cryptoIcons/usdc.svg",
    amount: 50,
    category: "Stable",
    usdValue: 1 * 50,
  },
];

const testPool: Pool = {
  tokens: testTokens,
  tvl: "$29,573.57",
  maxApr: "98.65%",
  userLiquidity: 30,
};

const pools: Pool[] = [
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
  testPool,
];

const args = {
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

const PoolsOverview = () => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  const [navOpen, setNavOpen] = React.useState(largerThenMd ? true : false);

  return (
    <Box sx={{}}>
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
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pools
          pools={pools}
          filter="ALL"
          sort="HighAPR"
          onAddLiquidityClick={() => {}}
          onShowDetailsClick={() => {}}
          onFilterClick={() => {}}
          onSortSelect={() => {}}
        />
      </Box>
    </Box>
  );
};

export { PoolsOverview };
