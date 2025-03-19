import React from "react";
import { Button as MuiButton } from "@mui/material";
import Colors from "../Theme/colors";
import { ButtonProps } from "@phoenix-protocol/types";

const Button = ({
  type = "primary",
  size = "medium",
  label,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const styles = {
    wrapper: {
      display: "inline-block",
      background:
        type === "secondary"
          ? "linear-gradient(180deg, #F97316 0%, #E29E1B 100%)"
          : "transparent", // Adjusted background
      padding: "1px",
      borderRadius: "12px",

      width: "100%",
    },
    button: {
      display: "block",
      background:
        type === "primary"
          ? "linear-gradient(180deg, #F97316 0%, #E29E1B 100%)"
          : "var(--neutral-900, #171717)", // Adjusted background
      border:
        type === "primary" ? "none" : "1px solid var(--neutral-700, #404040)", // Adjusted border
      padding: size === "medium" ? "12px 32px" : "8px 24px", // Adjusted padding
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "20px",
      textTransform: "none",
      color:
        type === "primary"
          ? "var(--neutral-50, #FAFAFA)"
          : "var(--neutral-300, #D4D4D4)", // Adjusted color
      width: "100%",
      "&:hover": {
        background:
          type === "primary"
            ? "rgba(249, 115, 22, 0.8)"
            : "var(--neutral-800, #262626)", // Adjusted background on hover
      },
    },
  };

  const { sx, ...otherProps } = props;

  return (
    <div style={styles.wrapper}>
      <MuiButton
        size={size}
        disabled={props.disabled}
        //  @ts-ignore
        sx={{
          ...styles.button,
          ...(sx || {}), // Merge with existing sx prop or an empty object
        }}
        fullWidth
        {...otherProps}
      >
        {props.children || label}
      </MuiButton>
    </div>
  );
};

export { Button };
