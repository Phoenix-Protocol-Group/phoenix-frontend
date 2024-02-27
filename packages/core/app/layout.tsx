"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Providers from "../providers";
import TopBar from "@/components/TopBar/TopBar";
import SideNav from "@/components/SideNav/SideNav";
import { usePathname, useRouter } from "next/navigation";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import JoyRideTooltip from "@/components/JoyRideTooltip";
import { joyride } from "@phoenix-protocol/utils";
import { TourModal } from "@phoenix-protocol/ui";
import { Analytics } from "@vercel/analytics/react";

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
  // Get PersistStore
  const persistStore = usePersistStore();
  // State to manage tour initialization
  const [initialized, setInitialized] = useState(false);
  // State to handle tour modal open/close
  const [tourModalOpen, setTourModalOpen] = useState(false);
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

    // Navigate to pools page on eight step
    if (action === ACTIONS.NEXT && index === 7) {
      appStore.setTourStep(7);
      // Navigate to pools page
      router.push("/pools");
    }

    // Navigate to pool single page on ninth step
    if (action === ACTIONS.NEXT && index === 8) {
      appStore.setTourStep(8);
      // Navigate to pool single page
      router.push(
        "/pools/CBT4WEAHQ72AYRD7WZFNYE6HGZEIX25754NG37LBLXTTRMWKQNKIUR6O"
      );
    }

    // End the tour after the last step
    if (action === ACTIONS.NEXT && index === 11) {
      appStore.setTourStep(10);
      appStore.setTourRunning(false);
      persistStore.setUserTourActive(false);
      persistStore.skipUserTour();
    }

    if ([EVENTS.STEP_AFTER].includes(type)) {
      // Update state to advance the tour
      appStore.setTourStep(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if (action === ACTIONS.NEXT && type === EVENTS.TARGET_NOT_FOUND) {
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
  // Also we check the local storage to see if the user has already completed the tour
  // Or if the user already skipped the tour
  useEffect(() => {
    // If the user has already skipped the tour or completed it, we don't need to show it again
    if (persistStore.userTour.skipped && !persistStore.userTour.active) {
      setInitialized(true);
      appStore.setTourRunning(false);
      return;
    }

    // If the user has started the tour, we need to resume it from the last step
    if (persistStore.userTour.active) {
      appStore.setTourRunning(true);
      appStore.setTourStep(persistStore.userTour.step);
    }

    // If the user never started or skipped the tour, we need to start it from the beginning
    // This means, from the modal, which then starts the tour
    // Also we got to redirect the user to the home page
    if (
      !persistStore.userTour.active &&
      !persistStore.userTour.skipped &&
      persistStore.userTour.step === 0
    ) {
      setTourModalOpen(true);
      router.push("/");
    }

    // Delay the tour to avoid hydration issues
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Style object for swap page background image
  const swapPageStyle = {
    backgroundImage: `url("/swapBg.png")`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundSize: { xs: "cover", md: "50% 100%" },
    paddingBottom: "50px",
    width: {
      xs: "100vw",
      md: largerThenMd
        ? navOpen
          ? "calc(100% - 240px)"
          : "calc(100% - 60px)"
        : navOpen
        ? "0"
        : "100%",
    },
  };

  // Hacky way to avoid overflows
  const css = `
    body {
      overflow-x: hidden!important;
    }
  `;

  return (
    <html lang="en">
      <head>
        <meta
          name="description"
          content="Explore Phoenix DeFi Hub on Soroban - your gateway to innovative decentralized finance solutions. Experience seamless, secure, and advanced DeFi services with cutting-edge smart contract capabilities. Join the future of finance today."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.phoenix-hub.io" />
        <meta property="og:title" content="Phoenix DeFi Hub on Soroban" />
        <meta
          property="og:description"
          content="Explore Phoenix DeFi Hub on Soroban - your gateway to innovative decentralized finance solutions. Experience seamless, secure, and advanced DeFi services with cutting-edge smart contract capabilities. Join the future of finance today."
        />
        <meta
          property="og:image"
          content="https://app.phoenix-hub.io//socials.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://app.phoenix-hub.io" />
        <meta name="twitter:title" content="Phoenix DeFi Hub on Soroban" />
        <meta
          name="twitter:description"
          content="Explore Phoenix DeFi Hub on Soroban - your gateway to innovative decentralized finance solutions. Experience seamless, secure, and advanced DeFi services with cutting-edge smart contract capabilities. Join the future of finance today."
        />
        <meta
          name="twitter:image"
          content="https://app.phoenix-hub.io/socials-square.png"
        />

        {/* Additional tags for responsiveness and browser compatibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      {/* Wrap components with Providers for context availability */}
      <Providers>
        <body suppressHydrationWarning={true}>
          <style>{css}</style>
          {/* Side Navigation Component */}
          <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

          {/* Top Navigation Bar */}
          <TopBar navOpen={navOpen} setNavOpen={setNavOpen} />
          {/* Joyride Tour */}
          {initialized && (
            <>
              <TourModal
                open={tourModalOpen}
                setOpen={(state) => {
                  setTourModalOpen(state);
                  appStore.setTourRunning(false);
                  persistStore.skipUserTour();
                }}
                onClick={() => {
                  setTourModalOpen(false);
                  appStore.setTourRunning(true);
                  persistStore.setUserTourActive(true);
                  persistStore.setUserTourStep(0);
                }}
              />
              <Joyride
                // @ts-ignore
                steps={joyride.steps}
                continuous={true}
                tooltipComponent={JoyRideTooltip}
                run={appStore.tourRunning}
                stepIndex={appStore.tourStep}
                callback={handleJoyrideCallback}
                disableScrolling={true}
                disableOverlayClose={true}
                keyboardNavigation={false}
                styles={{
                  options: {
                    arrowColor: "#1F2123",
                    zIndex: 1400,
                  },
                }}
              />
            </>
          )}

          {/* Main Content Area */}
          <Box
            sx={{
              marginLeft: largerThenMd
                ? navOpen
                  ? "240px"
                  : "60px"
                : "0",
              minHeight: "100vh",
              transition: "all 0.2s ease-in-out",
              display: "flex",
              justifyContent: "center",
              padding: "16px",
              ...swapPageStyle,
            }}
          >
            {/* Child Components */}
            {children}
          </Box>
        </body>
      </Providers>
      <Analytics />
    </html>
  );
}
