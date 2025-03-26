import React from "react";
import { Box, List, ListItem, Typography } from "@mui/material";
import { CardContainer } from "../../Common/CardContainer";
import { colors, typography, spacing } from "../../Theme/styleConstants";

interface SwapDetailsProps {
  exchangeRate: string;
  networkFee: string;
  route: string;
  slippageTolerance: string;
}

export const SwapDetails = ({
  exchangeRate,
  networkFee,
  route,
  slippageTolerance,
}: SwapDetailsProps) => {
  const listItemContainer = {
    display: "flex",
    justifyContent: "space-between",
    padding: `${spacing.xs} 0`,
  };

  const listItemNameStyle = {
    color: colors.neutral[400],
    fontSize: typography.fontSize.sm,
    lineHeight: "140%",
    marginBottom: 0,
    fontFamily: typography.fontFamily,
  };

  const listItemContentStyle = {
    color: colors.neutral[50],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeights.medium,
    lineHeight: "140%",
    fontFamily: typography.fontFamily,
  };

  return (
    <CardContainer sx={{ width: "100%" }}>
      <Typography
        sx={{
          fontWeight: typography.fontWeights.medium,
          fontSize: typography.fontSize.lg,
          color: colors.neutral[50],
          marginBottom: spacing.md,
          fontFamily: typography.fontFamily,
        }}
      >
        Swap Details
      </Typography>
      <List
        sx={{
          padding: 0,
          margin: 0,
        }}
      >
        <ListItem sx={listItemContainer}>
          <Typography sx={listItemNameStyle}>Exchange rate</Typography>
          <Typography sx={listItemContentStyle}>{exchangeRate}</Typography>
        </ListItem>
        <ListItem sx={listItemContainer}>
          <Typography sx={listItemNameStyle}>Protocol fee</Typography>
          <Typography sx={listItemContentStyle}>{networkFee}</Typography>
        </ListItem>
        <ListItem sx={listItemContainer}>
          <Typography sx={listItemNameStyle}>Route</Typography>
          <Typography sx={listItemContentStyle}>{route}</Typography>
        </ListItem>
        <ListItem sx={listItemContainer}>
          <Typography sx={listItemNameStyle}>Slippage tolerance</Typography>
          <Typography sx={listItemContentStyle}>{slippageTolerance}</Typography>
        </ListItem>
      </List>
    </CardContainer>
  );
};
