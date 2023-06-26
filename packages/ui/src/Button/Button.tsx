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
  onClick,
  label,
  ...props
}: ButtonProps) => {
  const styles = {
    background: type == "primary" ? Colors.primary : Colors.background,
    border: type == "primary" ? "none" : "1px solid",
    borderImage:
      "linear-gradient(180deg, #E2391B 0%, #E29E1B 100%),linear-gradient(0deg, #000000, #000000)",
    padding: size == "medium" ? "18px 40px 18px 40px" : "12px 40px 12px 40px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "20px",
    color: Colors.backgroundLight,
    "&:hover": {
      background:
        "linear-gradient(137deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%)",
    },
    "&:disabled": {
      background:
        "background: linear-gradient(137deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%)",
      opacity: 0.3,
    },
  };

  return (
    <MuiButton
      sx={{
        ...styles,
        ...props.sx,
      }}
      size={size}
      onClick={onClick}
      disabled={props.disabled}
    >
      {props.children || label}
    </MuiButton>
  );
};

export { Button };
