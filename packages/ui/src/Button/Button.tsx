import React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import Colors from '../Theme/colors';

export interface ButtonProps {
  type?: "primary" | "secondary";
  size?: "medium" | "small";
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button = ({
  type = "primary",
  size = "medium",
  onClick,
  label,
}: ButtonProps) => {
  return (
    <MuiButton
      sx={{
        background: type == "primary" ? Colors.primary : Colors.background,
        border: type == "primary" ? "none" : "1px solid",
        borderImage: "linear-gradient(180deg, #E2391B 0%, #E29E1B 100%),linear-gradient(0deg, #000000, #000000)",
        padding: size == "medium" ? "18px 40px 18px 40px" : "12px 40px 12px 40px",
        borderRadius: "16px",
        fontSize: "14px",
        fontWeight: "700",
        lineHeight: "20px",
        color: Colors.backgroundLight
      }}
      size={size}
      onClick={onClick}
    >
      {label}
    </MuiButton>
  );
};


export { Button };
