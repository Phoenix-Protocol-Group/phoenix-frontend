"use client";

import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Providers from "../providers";
import TopBar from "@/components/TopBar/TopBar";
import SideNav from "@/components/SideNav/SideNav";
import { usePathname } from "next/navigation";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  const [navOpen, setNavOpen] = React.useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setNavOpen(largerThenMd ? true : false);
  }, [largerThenMd]);

  const swapPageStyle = {
    backgroundImage: `url("/swapBg.png")`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundSize: "50% 100%",
  };

  return (
    <html lang="en">
      <Providers>
        <body>
          <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
          <TopBar navOpen={navOpen} setNavOpen={setNavOpen} />
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
              minHeight: "100vh",
              transition: "all 0.2s ease-in-out",
              display: "flex",
              justifyContent: "center",
              padding: "16px",
              ...(() => {
                if (pathname === "/swap") {
                  return swapPageStyle;
                }
              })(),
            }}
          >
            {children}
          </Box>
        </body>
      </Providers>
    </html>
  );
}
