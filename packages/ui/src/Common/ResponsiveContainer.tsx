import React from "react";
import { Box, BoxProps } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { spacing } from "../Theme/styleConstants";

interface ResponsiveContainerProps extends BoxProps {
  children: React.ReactNode;
  mobileTopOffset?: boolean; // Whether to account for mobile AppBar
  fullWidthMobile?: boolean; // Whether to use full width on mobile
  maxWidth?: string | number; // Maximum width of the container
  noPadding?: boolean; // Whether to disable all padding
  compactMobile?: boolean; // Whether to use more compact mobile spacing
}

export type { ResponsiveContainerProps };

/**
 * ResponsiveContainer - A wrapper component that provides consistent responsive behavior
 * across the application with proper mobile layout handling.
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  mobileTopOffset = false,
  fullWidthMobile = false,
  maxWidth = "1440px",
  noPadding = false,
  compactMobile = false,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getResponsivePadding = () => {
    if (noPadding) return 0;

    if (compactMobile) {
      return {
        xs: spacing.xs,
        sm: spacing.sm,
        md: spacing.md,
      };
    }

    return fullWidthMobile
      ? { xs: spacing.xs, sm: spacing.sm, md: spacing.md }
      : { xs: spacing.sm, sm: spacing.md, md: spacing.lg };
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: mobileTopOffset && isMobile ? "70px" : 0,
        px: getResponsivePadding(),
        pb: noPadding ? 0 : { xs: spacing.md, sm: spacing.lg, md: spacing.xl },
        transition: "all 0.3s ease",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer;
