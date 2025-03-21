import React from "react";
import { Button as MuiButton } from "@mui/material";
import Colors from "../Theme/colors";
import { ButtonProps } from "@phoenix-protocol/types";

const Button = ({
  type = "primary",
  size = "medium",
  label,
  ...props
}: ButtonProps) => {
  const styles = {
    wrapper: {
      display: "inline-block",
      background: "linear-gradient(180deg, #E2391B 0%, #E29E1B 100%)",
      padding: "1px",
      borderRadius: "12px",
      width: props.fullWidth ? "100%" : "auto",
    },
    button: {
      background:
        type === "primary"
          ? "linear-gradient(135deg, #E2391B 0%, #E29E1B 100%)"
          : Colors.background,
      border: "none",
      padding: size === "medium" ? "14px 32px" : "10px 24px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "700",
      lineHeight: "20px",
      textTransform: "none",
      color: Colors.backgroundLight,
      width: "100%",
      boxShadow:
        type === "primary" ? "0px 2px 6px rgba(226, 73, 26, 0.4)" : "none",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: type === "primary" ? "translateY(-2px)" : "none",
        boxShadow:
          type === "primary" ? "0px 4px 8px rgba(226, 73, 26, 0.5)" : "none",
      },
    },
  };

  const { sx, ...otherProps } = props;

  return (
    <div style={type === "secondary" ? styles.wrapper : {}}>
      <MuiButton
        size={size}
        disabled={props.disabled}
        //  @ts-ignore
        sx={{
          ...(styles.button as React.CSSProperties), // Ensure styles are cast to valid CSS properties
          ...((sx as Record<string, any>) || {}), // Ensure sx is properly typed
        }}
        {...otherProps}
      >
        {props.children || label}
      </MuiButton>
    </div>
  );
};

export { Button };
