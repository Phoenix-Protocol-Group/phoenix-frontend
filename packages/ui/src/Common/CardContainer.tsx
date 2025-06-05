import React from "react";
import { Box, BoxProps } from "@mui/material";
import { cardStyles } from "../Theme/styleConstants";

interface CardContainerProps extends BoxProps {
  highlighted?: boolean;
  noPadding?: boolean;
  children: React.ReactNode;
}

export const CardContainer = ({
  highlighted = false,
  noPadding = false,
  children,
  sx = {},
  ...props
}: CardContainerProps) => {
  return (
    <Box
      sx={{
        ...cardStyles.base,
        ...(highlighted ? cardStyles.highlighted : {}),
        ...(noPadding ? { padding: 0 } : {}),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
