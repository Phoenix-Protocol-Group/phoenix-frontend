import React from "react";
import { Box, ButtonBase, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

interface MobileTouchTargetProps {
  children: React.ReactNode;
  onClick?: () => void;
  minTouchTarget?: number; // Minimum touch target size in pixels
  hapticFeedback?: boolean; // Whether to simulate haptic feedback
  disabled?: boolean;
  sx?: any;
  component?: React.ElementType;
}

export type { MobileTouchTargetProps };

/**
 * MobileTouchTarget - A component that ensures proper touch targets on mobile devices
 *
 * Features:
 * - Minimum 44px touch targets on mobile (Apple HIG compliance)
 * - Haptic feedback simulation with scale animations
 * - Responsive sizing based on device type
 * - Accessibility improvements for touch interfaces
 */
export const MobileTouchTarget: React.FC<MobileTouchTargetProps> = ({
  children,
  onClick,
  minTouchTarget = 44,
  hapticFeedback = true,
  disabled = false,
  sx = {},
  component = "div",
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Use ButtonBase for clickable elements, Box for non-clickable
  const Component = onClick ? ButtonBase : Box;

  const motionVariants = {
    tap: hapticFeedback && !disabled ? { scale: 0.96 } : {},
    hover: !isMobile && !disabled ? { scale: 1.02 } : {},
  };

  const baseStyles = {
    minWidth: isMobile ? `${minTouchTarget}px` : "auto",
    minHeight: isMobile ? `${minTouchTarget}px` : "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: onClick && !disabled ? "pointer" : "default",
    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTapHighlightColor: "transparent",
    transition: "all 0.2s ease",
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: "2px",
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    ...sx,
  };

  if (onClick) {
    return (
      <ButtonBase
        component={motion.div}
        whileHover={motionVariants.hover}
        whileTap={motionVariants.tap}
        onClick={onClick}
        disabled={disabled}
        sx={baseStyles}
        {...props}
      >
        {children}
      </ButtonBase>
    );
  }

  return (
    <Box component={component} sx={baseStyles} {...props}>
      {children}
    </Box>
  );
};

export default MobileTouchTarget;
