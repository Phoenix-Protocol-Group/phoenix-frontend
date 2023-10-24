import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import Colors from "../Theme/colors";
import { Modify } from "../helpers";

interface ButtonProps
  extends Modify<
    MuiButtonProps,
    {
      type?: "primary" | "secondary";
      size?: "medium" | "small";
      label: string;
    }
  > {}

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
      padding: "1px", // This is the border witdh
      borderRadius: "16px",
    },
    button: {
      background: type === "primary" ? Colors.primary : Colors.background,
      border: "none",
      padding:
        size === "medium" ? "18px 40px 18px 40px" : "12px 40px 12px 40px",
      borderRadius: "15px", // Slighter less then the wrapper to show the border
      fontSize: "14px",
      fontWeight: "700",
      lineHeight: "20px",
      textTransform: "none",
      color: Colors.backgroundLight,
      width: "100%",
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
          ...styles.button,
          ...props.sx,
        }}
        {...otherProps}
      >
        {props.children || label}
      </MuiButton>
    </div>
  );
};

export { Button };
