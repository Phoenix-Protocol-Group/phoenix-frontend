"use client";

import React, { ReactNode, useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Providers from "../providers";
import TopBar from "@/components/TopBar/TopBar";
import SideNav from "@/components/SideNav/SideNav";
import { usePathname, useRouter } from "next/navigation";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import JoyRideTooltip from "@/components/JoyRideTooltip";
import { joyride } from "@phoenix-protocol/utils";
import { DisclaimerModal, TourModal } from "@phoenix-protocol/ui";
import { Analytics } from "@vercel/analytics/react";
import { motion } from "framer-motion";

/**
 * RootLayout Component
 * The main layout for the application, wrapping all child components with necessary providers,
 * navigation, modals, and tour functionality.
 *
 * @component
 * @param {ReactNode} children - The children components that will be rendered inside the layout.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  // Use theme for responsive design
  const theme = useTheme();
  // Media query to check screen size
  const largerThanMd = useMediaQuery(theme.breakpoints.up("md"));
  // State to manage navigation open/close status, initializing based on screen size
  const [navOpen, setNavOpen] = useState<boolean>(largerThanMd);
  // Retrieve the current pathname
  const pathname = usePathname();
  // Get AppStore
  const appStore = useAppStore();
  // Get PersistStore
  const persistStore = usePersistStore();
  // State to manage tour initialization
  const [initialized, setInitialized] = useState<boolean>(false);
  // State to handle tour modal open/close
  const [tourModalOpen, setTourModalOpen] = useState<boolean>(false);
  // State to handle disclaimer modal
  const [disclaimerModalOpen, setDisclaimerModalOpen] =
    useState<boolean>(false);
  // Router
  const router = useRouter();

  /**
   * Callback for Joyride tour.
   * Handles different actions such as navigating to different pages during the tour.
   *
   * @param {Object} data - Joyride callback data.
   */
  const handleJoyrideCallback = useCallback(
    async (data: any) => {
      const { action, index, status, type } = data;

      // Open Wallet Modal on second step
      if (action === ACTIONS.NEXT && index === 1) {
        appStore.setWalletModalOpen(true);
      }

      // Close Wallet Modal on third step
      if (action === ACTIONS.NEXT && index === 2) {
        appStore.setWalletModalOpen(false);
      }

      // Navigate to swap page on fourth step
      if (action === ACTIONS.NEXT && index === 3) {
        appStore.setTourStep(4);
        router.push("/swap");
      }

      // Navigate to pools page on eighth step
      if (action === ACTIONS.NEXT && index === 7) {
        appStore.setTourStep(7);
        router.push("/pools");
      }

      // Navigate to pool single page on ninth step
      if (action === ACTIONS.NEXT && index === 8) {
        appStore.setTourStep(8);
        router.push(
          "/pools/CBHCRSVX3ZZ7EGTSYMKPEFGZNWRVCSESQR3UABET4MIW52N4EVU6BIZX"
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
        appStore.setTourStep(index + (action === ACTIONS.PREV ? -1 : 1));
      } else if (action === ACTIONS.NEXT && type === EVENTS.TARGET_NOT_FOUND) {
        appStore.setTourRunning(false);
      } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        appStore.setTourRunning(false);
      }
    },
    [router]
  );

  // useEffect to set navigation state based on screen size without animation on initial load
  useEffect(() => {
    if (navOpen !== largerThanMd) {
      setNavOpen(largerThanMd);
    }
  }, [largerThanMd]);

  // Use effect hook to prune the persist store on page load if wallet-connect
  useEffect(() => {
    const appStorageValue = localStorage?.getItem("app-storage");
    if (appStorageValue !== null) {
      const parsedValue = JSON.parse(appStorageValue);
      const walletType = parsedValue?.state?.wallet?.walletType;
      if (walletType === "wallet-connect") {
        persistStore.disconnectWallet();
      }
    }
  }, [persistStore]);

  // Use effect hook to delay the joyride until the page has loaded to avoid hydration issues
  useEffect(() => {
    if (persistStore.userTour.skipped && !persistStore.userTour.active) {
      setInitialized(true);
      appStore.setTourRunning(false);
      return;
    }

    if (persistStore.userTour.active) {
      appStore.setTourRunning(true);
      appStore.setTourStep(persistStore.userTour.step);
    }

    const appStorageValue = localStorage?.getItem("app-storage");
    let skippedTour: boolean = false;

    if (appStorageValue !== null) {
      try {
        const parsedValue = JSON.parse(appStorageValue);
        skippedTour = parsedValue?.state?.userTour?.skipped;
      } catch (error) {
        console.error("Error parsing app-storage value:", error);
      }
    }

    if (
      !persistStore.userTour.active &&
      !persistStore.userTour.skipped &&
      persistStore.userTour.step === 0 &&
      !skippedTour
    ) {
      setTourModalOpen(true);
      router.push("/");
    }

    if (!persistStore.disclaimer.accepted) {
      setDisclaimerModalOpen(true);
    }

    const timer = setTimeout(() => {
      setInitialized(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [persistStore, router]);

  /**
   * Handles accepting or rejecting the disclaimer.
   *
   * @param {boolean} accepted - Whether the disclaimer was accepted.
   */
  const onAcceptDisclaimer = (accepted: boolean) => {
    if (accepted) {
      persistStore.setDisclaimerAccepted(true);
      setDisclaimerModalOpen(false);
    } else {
      window.location.assign("http://google.com");
    }
  };

  // Styles for different pages
  const swapPageStyle = {
    backgroundImage: `url("/swapBg.png")`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundSize: { xs: "cover", md: "50% 100%" },
    paddingBottom: "50px",
    width: {
      xs: "100vw",
      md: largerThanMd
        ? navOpen
          ? "calc(100% - 240px)"
          : "calc(100% - 60px)"
        : "100%",
    },
  };

  const poolPageStyles = {
    backgroundImage: `url("/BG.svg")`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundSize: "cover",
    paddingBottom: "50px",
    width: {
      xs: "100vw",
      md: largerThanMd
        ? navOpen
          ? "calc(100% - 240px)"
          : "calc(100% - 60px)"
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

          {/* Side Navigation Component with smooth animation, disabled on initial load */}

          <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

          {/* Top Navigation Bar with motion */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <TopBar navOpen={navOpen} setNavOpen={setNavOpen} />
          </motion.div>

          {/* Joyride Tour */}
          {initialized && persistStore.disclaimer.accepted && (
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

          <DisclaimerModal
            open={!persistStore.disclaimer.accepted}
            onAccepted={onAcceptDisclaimer}
          />

          {/* Main Content Area */}
          <Box
            sx={{
              marginLeft: largerThanMd ? (navOpen ? "240px" : "60px") : "0",
              minHeight: "100vh",
              transition: "all 0.2s ease-in-out",
              display: "flex",
              justifyContent: "center",
              padding: "16px",
              ...(pathname === "/pools" ? poolPageStyles : swapPageStyle),
            }}
          >
            {/* Child Components */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </Box>
        </body>
      </Providers>
      <Analytics />
    </html>
  );
}
