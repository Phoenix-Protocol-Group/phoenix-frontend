"use client";

import React from "react";
import type { Metadata } from "next";
import { useMediaQuery, useTheme } from "@mui/material";
import Providers from "../providers";
import { SidebarNavigation } from "@phoenix-protocol/ui";
import AppBar from "@phoenix-protocol/ui/build/AppBar/AppBar";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  const [navOpen, setNavOpen] = React.useState(largerThenMd ? true : false);

  return (
    <html lang="en">
      <Providers>
        <body>
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
          {children}
        </body>
      </Providers>
    </html>
  );
}
