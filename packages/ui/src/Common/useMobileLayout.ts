import { useTheme, useMediaQuery } from "@mui/material";
import { useMemo } from "react";

interface MobileLayoutConfig {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  appBarHeight: string;
  sidebarWidth: {
    collapsed: string;
    expanded: string;
  };
  gridSpacing: number;
  cardPadding: string;
  minTouchTarget: string;
}

/**
 * useMobileLayout - A hook that provides mobile-responsive layout utilities
 *
 * Returns:
 * - Device type detection (mobile, tablet, desktop)
 * - Responsive spacing values
 * - Layout-specific measurements
 * - Grid and component sizing helpers
 */
export const useMobileLayout = (): MobileLayoutConfig => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const config = useMemo(
    () => ({
      isMobile,
      isTablet,
      isDesktop,
      spacing: {
        xs: isMobile ? "8px" : "12px",
        sm: isMobile ? "12px" : "16px",
        md: isMobile ? "16px" : "24px",
        lg: isMobile ? "24px" : "32px",
        xl: isMobile ? "32px" : "48px",
      },
      appBarHeight: "70px",
      sidebarWidth: {
        collapsed: "60px",
        expanded: "240px",
      },
      gridSpacing: isMobile ? 2 : 3,
      cardPadding: isMobile ? "12px 16px" : "16px 24px",
      minTouchTarget: isMobile ? "44px" : "40px",
    }),
    [isMobile, isTablet, isDesktop]
  );

  return config;
};

/**
 * getMobileStyles - Helper function to get mobile-specific styles
 */
export const getMobileStyles = (isMobile: boolean) => ({
  appBarOffset: {
    mt: isMobile ? "70px" : 0,
  },
  responsivePadding: {
    px: isMobile ? 1 : 3,
    py: isMobile ? 2 : 3,
  },
  compactSpacing: {
    gap: isMobile ? 1 : 2,
  },
  touchTarget: {
    minHeight: isMobile ? "44px" : "40px",
    minWidth: isMobile ? "44px" : "40px",
  },
});

export default useMobileLayout;
