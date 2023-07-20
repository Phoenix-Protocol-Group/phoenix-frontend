"use client";

import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Providers from "../providers";
import { SidebarNavigation, AppBar } from "@phoenix-protocol/ui";
import MailIcon from "@mui/icons-material/Mail";

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
  appBarArgs: {
    balance: 125.5,
    walletAddress: "GBUHRWJBXS4YAEOVDRWFW6ZC5LLF2SAOMATH4I6YOTZYHE65FQRFOKG2",
    connectWallet: () => {},
    disconnectWallet: () => {},
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  const [navOpen, setNavOpen] = React.useState(largerThenMd ? true : false);

  useEffect(() => {
    setNavOpen(largerThenMd ? true : false);
  }, [largerThenMd]);

  const navItems = [
    {
      label: "Dashboard",
      icon: <MailIcon />,
      active: false,
      href: "#",
    },
    {
      label: "Swap",
      icon: <MailIcon />,
      active: false,
      href: "#",
    },
    {
      label: "Pools",
      icon: <MailIcon />,
      active: true,
      href: "#",
    },
  ];

  return (
    <html lang="en">
      <Providers>
        <body>
          <SidebarNavigation
            onNavClick={() => {}}
            items={navItems}
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
              padding: "16px",
            }}
          >
            {children}
          </Box>
        </body>
      </Providers>
    </html>
  );
}
