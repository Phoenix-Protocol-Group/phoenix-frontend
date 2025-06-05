"use client";

import React, {
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  Fragment,
} from "react";
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

// Client-side only component for title updates
const HiddenInputChecker = () => {
  const [value, setValue] = useState("Phoenix DeFi Hub");
  const pathName = usePathname();

  // Use a ref to track initial render
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip the first render to prevent unnecessary DOM access
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // This logic now only runs on subsequent route changes
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

  const largerThanMd = useMediaQuery("(min-width: 960px)", {
    noSsr: true, // Disable server-side rendering for this query
    defaultMatches: true, // Default to true for SSR compatibility
  });
  // State to manage navigation open/close status, initializing based on screen size
  const [navOpen, setNavOpen] = useState<boolean>(false); // Start with false for SSR compatibility

  // State for client-side rendering detection
  const [isClient, setIsClient] = useState(false);

  // Layout store
  const appStore = useAppStore();

  // Pathname for navigation
  const pathname = usePathname();

  // Get PersistStore
  const persistStore = usePersistStore();

  // For wallet address changes, generate new version key to avoid hydration mismatch
  const [version, setVersion] = useState(0);

  // Handle disclaimer modal - initialize closed for SSR
  const [disclaimerModalOpen, setDisclaimerModalOpen] =
    useState<boolean>(false);

  // Mark client-side rendering and initialize nav state based on screen size
  useEffect(() => {
    setIsClient(true);
    setNavOpen(largerThanMd);
  }, [largerThanMd]);

  // Update version when wallet address changes - client-side only
  useEffect(() => {
    if (isClient) {
      setVersion((prev) => prev + 1);
    }
  }, [persistStore.wallet.address, isClient]);

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

  // Use effect to handle route changes and set loading state - run once per route change
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      appStore.setLoading(true);
    } else {
      // Set loading immediately on route change to prevent flash of content
      appStore.setLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Clean up wallet-connect sessions on page load - client-side only
  useEffect(() => {
    if (isClient) {
      try {
        const appStorageValue = localStorage?.getItem("app-storage");
        if (appStorageValue !== null) {
          const parsedValue = JSON.parse(appStorageValue);
          const walletType = parsedValue?.state?.wallet?.walletType;
          if (walletType === "wallet-connect") {
            persistStore.disconnectWallet();
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  }, [persistStore, isClient]); // Add isClient dependency

  // Update disclaimer modal state - client-side only
  useEffect(() => {
    if (isClient) {
      setDisclaimerModalOpen(!persistStore.disclaimer.accepted);
    }
  }, [persistStore.disclaimer.accepted, isClient]);

  /**
   * Handles accepting or rejecting the disclaimer.
   *
   * @param {boolean} accepted - Whether the disclaimer was accepted.
   */
  const onAcceptDisclaimer = useCallback(
    (accepted: boolean) => {
      if (accepted) {
        persistStore.setDisclaimerAccepted(true);
        setDisclaimerModalOpen(false);
      } else {
        window.location.assign("http://google.com");
      }
    },
    [persistStore]
  );

  // Memoize the style objects to prevent unnecessary re-renders
  const swapPageStyle = useMemo(
    () => ({
      background:
        "radial-gradient(ellipse at center, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 35%, #171717 75%)", // Added an intermediate color stop
      paddingBottom: "50px",
      width: {
        xs: "100%",
        md: "100%", // Full width since margin handles positioning
      },
    }),
    [] // Remove unnecessary dependencies
  );

  const loaderOverlayStyle = useMemo(
    () => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(#171717, #171717) padding-box, radial-gradient(ellipse at center, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 35%, #171717 75%) border-box",
      zIndex: 10, // Ensure it's on top of content
      // The following ensures the solid color is under the gradient
      backgroundBlendMode: "normal, lighten",
    }),
    []
  );

  const mainContentStyle = useMemo(
    () => ({
      position: "relative", // Add relative positioning for absolute loader overlay
      marginLeft: largerThanMd ? "246px" : 0, // Fixed sidebar width
      marginTop: { xs: "12px", md: "80px" }, // Add top margin for fixed TopBar on both mobile and desktop
      minHeight: { xs: "calc(100vh - 70px)", md: "calc(100vh - 80px)" }, // Account for fixed TopBar height
      transition: "all 0.2s ease-in-out",
      display: "flex",
      justifyContent: "center",
      padding: { xs: "16px 8px", sm: "20px 12px", md: "24px 16px" }, // Improved padding
      maxWidth: "none", // Remove any max-width constraints
      // Override swapPageStyle width and force components to think this is the full width for responsive behavior
      ...swapPageStyle,
      width: largerThanMd ? `auto` : "100vw", // Full width on mobile
    }),
    [largerThanMd, navOpen, swapPageStyle]
  );

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
        {isClient && <HiddenInputChecker />}
      </head>
      {/* Wrap components with Providers for context availability */}
      <Providers>
        <body suppressHydrationWarning={true} key={version}>
          <ToastProvider>
            <RestoreModalProvider>
              <style>{css}</style>

              {/* Side Navigation Component with smooth animation, disabled on initial load */}
              <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />

              {/* Top Navigation Bar with motion */}
              <motion.div
                initial={isClient ? { y: -50 } : false}
                animate={isClient ? { y: 0 } : false}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <TopBar navOpen={navOpen} setNavOpen={setNavOpen} />
              </motion.div>

              {isClient && (
                <DisclaimerModal
                  open={disclaimerModalOpen}
                  onAccepted={onAcceptDisclaimer}
                />
              )}

              {/* Main Content Area */}
              <Box sx={mainContentStyle}>
                <Box sx={{ marginLeft: -"246px", width: "100%" }}>
                  {appStore.loading && (
                    <Box sx={loaderOverlayStyle}>
                      <Loader />
                    </Box>
                  )}
                  <Fragment>{children}</Fragment>
                </Box>
              </Box>
            </RestoreModalProvider>
          </ToastProvider>
        </body>
      </Providers>
      <Analytics />
    </html>
  );
}
