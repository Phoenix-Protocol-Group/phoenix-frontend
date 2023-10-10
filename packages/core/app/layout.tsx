"use client";

import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Providers from "../providers";
import TopBar from "@/components/TopBar/TopBar";
import SideNav from "@/components/SideNav/SideNav";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use theme for responsive design
  const theme = useTheme();
  // Media query to check screen size
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  // State to manage navigation open/close status
  const [navOpen, setNavOpen] = React.useState(false);
  // Retrieve the current pathname
  const pathname = usePathname();

  // useEffect to set navigation state based on screen size
  useEffect(() => {
    setNavOpen(largerThenMd);
  }, [largerThenMd]);

  // Style object for swap page background image
  const swapPageStyle = {
    backgroundImage: `url("/swapBg.png")`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundSize: "50% 100%",
  };

  return (
    <html lang="en">
      {/* Wrap components with Providers for context availability */}
      <Providers>
        <body>
          {/* Side Navigation Component */}
          <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

          {/* Top Navigation Bar */}
          <TopBar navOpen={navOpen} setNavOpen={setNavOpen} />

          {/* Main Content Area */}
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
              // Conditionally apply styles for swap page
              ...(pathname === "/swap" ? swapPageStyle : {}),
            }}
          >
            {/* Child Components */}
            {children}
          </Box>
        </body>
      </Providers>
    </html>
  );
}
