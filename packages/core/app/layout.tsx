"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Providers from "../providers";
import TopBar from "@/components/TopBar/TopBar";
import SideNav from "@/components/SideNav/SideNav";
import { usePathname, useRouter } from "next/navigation";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useAppStore } from "@phoenix-protocol/state";
import JoyRideTooltip from "@/components/JoyRideTooltip";
import { joyride } from "@phoenix-protocol/utils";

export default function RootLayout({ children }: { children: ReactNode }) {
  // Use theme for responsive design
  const theme = useTheme();
  // Media query to check screen size
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));
  // State to manage navigation open/close status
  const [navOpen, setNavOpen] = useState(false);
  // Retrieve the current pathname
  const pathname = usePathname();
  // Get AppStore
  const appStore = useAppStore();
  // State to manage tour initialization
  const [initialized, setInitialized] = useState(false);
  // Router
  const router = useRouter();

  // Joyride Tour
  const handleJoyrideCallback = async (data: any) => {
    const { action, index, status, type } = data;

    // Open Wallet Modal on second step
    if (action === ACTIONS.NEXT && index === 1) {
      // Mount Wallet Modal to show next step
      appStore.setWalletModalOpen(true);
    }

    // Close Wallet Modal on third step
    if (action === ACTIONS.NEXT && index === 2) {
      // Unmount Wallet Modal to show next step
      appStore.setWalletModalOpen(false);
    }

    // Navigate to swap page on fourth step
    if (action === ACTIONS.NEXT && index === 3) {
      appStore.setTourStep(4);
      // Navigate to swap page
      router.push("/swap");
    }

    if ([EVENTS.STEP_AFTER].includes(type)) {
      // Update state to advance the tour
      appStore.setTourStep(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if (action === ACTIONS.NEXT && type === EVENTS.TARGET_NOT_FOUND) {
      console.log(111);
      // If target not found, stop!
      appStore.setTourRunning(false);
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      appStore.setTourRunning(false);
    }
  };

  // useEffect to set navigation state based on screen size
  useEffect(() => {
    setNavOpen(largerThenMd);
  }, [largerThenMd]);

  // Use effect hook to delay the joyride until the page has loaded and avoid hydration issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialized(true);
      appStore.setTourRunning(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
          {/* Joyride Tour */}
          {initialized && (
            <Joyride
              // @ts-ignore
              steps={joyride.steps}
              continuous={true}
              tooltipComponent={JoyRideTooltip}
              spotlightClicks={true}
              run={appStore.tourRunning}
              stepIndex={appStore.tourStep}
              callback={handleJoyrideCallback}
              disableScrolling={true}
              styles={{
                options: {
                  arrowColor: "#1F2123",
                  zIndex: 1400,
                },
              }}
            />
          )}

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
