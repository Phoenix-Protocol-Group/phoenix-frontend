// Mobile Component Exports
export { MobileTouchTarget } from "./MobileTouchTarget";
export { MobileSkeleton } from "./MobileSkeleton";
export { PullToRefresh } from "./PullToRefresh";
export { MobileErrorHandler } from "./MobileErrorHandler";
export { SwipeGesture } from "./SwipeGesture";
export { useMobileLayout } from "./useMobileLayout";
export { ResponsiveContainer } from "./ResponsiveContainer";

// Type exports
export type { MobileTouchTargetProps } from "./MobileTouchTarget";
export type { MobileSkeletonProps } from "./MobileSkeleton";
export type { PullToRefreshProps } from "./PullToRefresh";
export type { MobileErrorHandlerProps } from "./MobileErrorHandler";
export type { SwipeGestureProps } from "./SwipeGesture";
export type { ResponsiveContainerProps } from "./ResponsiveContainer";

// Utility functions
export const getMobileStyles = (isMobile: boolean) => ({
  touchTarget: {
    minWidth: isMobile ? 44 : "auto",
    minHeight: isMobile ? 44 : "auto",
  },

  spacing: {
    xs: isMobile ? 8 : 12,
    sm: isMobile ? 12 : 16,
    md: isMobile ? 16 : 24,
    lg: isMobile ? 24 : 32,
    xl: isMobile ? 32 : 40,
  },

  borderRadius: {
    sm: isMobile ? 8 : 12,
    md: isMobile ? 12 : 16,
    lg: isMobile ? 16 : 20,
  },

  typography: {
    scale: isMobile ? 0.9 : 1,
  },
});

// Mobile breakpoints helper
export const mobileBreakpoints = {
  xs: "(max-width: 599px)",
  sm: "(max-width: 959px)",
  md: "(max-width: 1279px)",
  touch: "(hover: none) and (pointer: coarse)",
};
