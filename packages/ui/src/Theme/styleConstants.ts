/**
 * Style Constants
 *
 * This file contains shared styling constants for consistent design across the application.
 */

export const colors = {
  // Primary colors
  primary: {
    main: "#F97316",
    light: "#FDBA74",
    dark: "#C2410C",
    400: "#fb923c",
    600: "#ea580c",
    gradient:
      "linear-gradient(137deg, #F97316 0%, #F97316 17.08%, #F97316 42.71%, #F97316 100%)",
  },

  // Neutral colors
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    750: "#2a2a2a",
    800: "#262626",
    850: "#1a1a1a",
    900: "#171717",
  },
  // Semantic colors
  success: {
    main: "#66BB6A",
    light: "#E8F5E9",
    dark: "#2E7D32",
  },
  error: {
    main: "#E57373",
    light: "#FFEBEE",
    dark: "#C62828",
  },
  warning: {
    main: "#FFB74D",
    light: "#FFF8E1",
    dark: "#F57C00",
  },
  info: {
    main: "#29B6F6",
    light: "#E3F2FD",
    dark: "#0288D1",
  },

  // Special gradients
  gradients: {
    card: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    highlight:
      "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
    primaryGlow:
      "linear-gradient(137deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%)",
  },
};

export const shadows = {
  tooltip:
    "-3px 3px 10px 0px rgba(25, 13, 1, 0.10), -12px 13px 18px 0px rgba(25, 13, 1, 0.09), -26px 30px 24px 0px rgba(25, 13, 1, 0.05), -46px 53px 28px 0px rgba(25, 13, 1, 0.02), -73px 83px 31px 0px rgba(25, 13, 1, 0.00)",
  card: "0px 4px 20px rgba(0, 0, 0, 0.25)",
  elevated: "0px 8px 16px rgba(0, 0, 0, 0.12)",
};

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  xxl: "3rem", // 48px
};

export const borderRadius = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
};

export const typography = {
  fontFamily: "Ubuntu, sans-serif",
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  fontSize: {
    xxs: "0.625rem", // 10px
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    xxl: "1.5rem", // 24px
    display: "2rem", // 32px
  },
};

export const cardStyles = {
  base: {
    borderRadius: borderRadius.lg,
    background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${
      colors.neutral[850] || "#1a1a1a"
    } 100%)`,
    border: `1px solid ${colors.neutral[700]}`,
    padding: spacing.lg,
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)`,
    backdropFilter: "blur(10px)",
  },
  hover: {
    border: `1px solid ${colors.primary.main}`,
    background: `linear-gradient(145deg, ${
      colors.neutral[750] || "#2a2a2a"
    } 0%, ${colors.neutral[800]} 100%)`,
    boxShadow: `0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(249, 115, 22, 0.1)`,
    transition: "all 0.3s ease-in-out",
  },
  highlighted: {
    background: `linear-gradient(145deg, rgba(249, 115, 22, 0.08) 0%, rgba(249, 115, 22, 0.04) 100%)`,
    border: `1px solid ${colors.primary.main}`,
    boxShadow: `0 8px 25px rgba(249, 115, 22, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)`,
  },
};

// Common component styles
export const commonStyles = {
  tooltip: {
    background: colors.gradients.card,
    border: `1px solid ${colors.neutral[800]}`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.neutral[50],
    boxShadow: shadows.tooltip,
  },
};
