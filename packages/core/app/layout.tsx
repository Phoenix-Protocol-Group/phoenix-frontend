"use client";

import React, { ReactNode, useEffect, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Providers from "../providers";
import TopBar from "@/components/TopBar/TopBar";
import SideNav from "@/components/SideNav/SideNav";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore, usePersistStore } from "@phoenix-protocol/state";
import { DisclaimerModal } from "@phoenix-protocol/ui";
import { Analytics } from "@vercel/analytics/react";
import { motion } from "framer-motion";
import { ToastProvider } from "@/providers/ToastProvider";
import { RestoreModalProvider } from "@/providers/RestoreModalProvider";
import Loader from "@/components/Loader/Loader";
import TemporaryWarningBar from "@/components/TemporaryWarningBar";

const HiddenInputChecker = () => {
  const [value, setValue] = useState("Phoenix DeFi Hub");
  const pathName = usePathname();

  useEffect(() => {
    const hiddenInput = document.querySelector(
      'input[type="hidden"]'
    ) as HTMLInputElement;
    if (hiddenInput) {
      setValue(hiddenInput.value);
    }
  }, [pathName]);

  return <title>{value}</title>;
};

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
  // Layout store
  const appStore = useAppStore();

  // Pathname
  const pathname = usePathname();

  // Get PersistStore
  const persistStore = usePersistStore();
  // State to handle disclaimer modal
  const [disclaimerModalOpen, setDisclaimerModalOpen] =
    useState<boolean>(false);
  const [version, setVersion] = useState(0);

  // useEffect to set navigation state based on screen size without animation on initial load
  useEffect(() => {
    if (navOpen !== largerThanMd) {
      setNavOpen(largerThanMd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [largerThanMd]);

  useEffect(() => {
    setVersion((prev) => prev + 1);
  }, [persistStore.wallet.address]);

  // Disable Scrolling while loading
  useEffect(() => {
    if (appStore.loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [appStore.loading]);

  // Use effect to handle route changes and set loading state
  useEffect(() => {
    appStore.setLoading(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
  }, []);

  useEffect(() => {
    if (!persistStore.disclaimer.accepted) {
      setDisclaimerModalOpen(true);
    }
  }, [persistStore.disclaimer.accepted]);
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
    //backgroundImage: `url("/swapBg.png")`,
    //backgroundRepeat: "no-repeat",
    //backgroundAttachment: "fixed",
    //backgroundPosition: "center",
    //backgroundSize: { xs: "cover", md: "50% 100%" },
    background: "linear-gradient(to bottom, #1F2123, #131517)",

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
        <HiddenInputChecker />
      </head>
      {/* Wrap components with Providers for context availability */}
      <Providers>
        <body suppressHydrationWarning={true} key={version}>
          <ToastProvider>
            <RestoreModalProvider>
              <style>{css}</style>

              {/* Side Navigation Component with smooth animation, disabled on initial load */}

              <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
              {/* If loading */}

              {/* Top Navigation Bar with motion */}
              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <TopBar navOpen={navOpen} setNavOpen={setNavOpen} />
              </motion.div>

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
                  ...swapPageStyle,
                }}
              >
                {appStore.loading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background:
                        "linear-gradient(to bottom, #1F2123, #131517)",

                      zIndex: 10, // Ensure it's on top
                    }}
                  >
                    <Loader />
                  </Box>
                )}
                {children}
              </Box>
            </RestoreModalProvider>
          </ToastProvider>
        </body>
      </Providers>
      <Analytics />
    </html>
  );
}
