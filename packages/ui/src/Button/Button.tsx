import React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  type?: "primary" | "secondary";
  /**
   * What background color to use
   */
  textColor?: string;
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large";
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

/**
 * Primary UI component for user interaction
 */

const Button = ({
  textColor,
  size = "medium",
  onClick,
  label,
}: ButtonProps) => {
  return (
    <MuiButton
      style={textColor ? { color: textColor } : {}}
      size={size}
      onClick={onClick}
    >
      {label}
    </MuiButton>
  );
};


export { Button };
