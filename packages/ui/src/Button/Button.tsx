import React from "react";
import { Button as MuiButton } from "@mui/material";
import { ButtonProps } from "@phoenix-protocol/types";
import { colors, borderRadius, typography, shadows } from "../Theme/styleConstants";

const Button = ({
  type = "primary",
  size = "medium",
  label,
  ...props
}: ButtonProps) => {
  // Define consistent styling based on our style constants
  const styles = {
    wrapper: {
      display: "inline-block",
      background: colors.primary.gradient,
      padding: "1px",
      borderRadius: borderRadius.lg,
      width: props.fullWidth ? "100%" : "auto",
    },
    button: {
      background:
        type === "primary"
          ? colors.primary.gradient
          : colors.gradients.card,
      border: "none",
      padding: size === "medium" ? "14px 32px" : "10px 24px",
      borderRadius: borderRadius.lg,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeights.bold,
      fontFamily: typography.fontFamily,
      lineHeight: "20px",
      textTransform: "none",
      color: "#FFFFFF",
      width: "100%",
      boxShadow:
        type === "primary" ? shadows.elevated : "none",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: type === "primary" ? "translateY(-2px)" : "none",
        boxShadow:
          type === "primary" ? shadows.card : "none",
      },
      "&:disabled": {
        background: colors.neutral[700],
        color: colors.neutral[400],
      },
    },
  };

  const { sx, ...otherProps } = props;

  return (
    <div style={type === "secondary" ? styles.wrapper : {}}>
      <MuiButton
        size={size}
        disabled={props.disabled}
        sx={{
          ...(styles.button as React.CSSProperties),
          ...((sx as Record<string, any>) || {}),
        }}
        {...otherProps}
      >
        {props.children || label}
      </MuiButton>
    </div>
  );
};

export { Button };
