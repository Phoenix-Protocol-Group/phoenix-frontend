import { Box, Skeleton, Typography, List, ListItem } from "@mui/material";
import React from "react";
import { colors, typography, spacing, borderRadius } from "../../Theme/styleConstants";

const listItemContainer = {
  display: "flex",
  justifyContent: "space-between",
  padding: `${spacing.xs} 0`,
};

const listItemNameStyle = {
  color: "rgba(255, 255, 255, 0.70)",
  fontSize: typography.fontSize.sm,
  fontFamily: typography.fontFamily,
  lineHeight: "140%",
  marginBottom: 0,
};

const listItemContentStyle = {
  color: colors.neutral[50],
  fontSize: typography.fontSize.sm,
  fontFamily: typography.fontFamily,
  fontWeight: typography.fontWeights.bold,
  lineHeight: "140%",
};

export const Swap = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: spacing.md,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: colors.neutral[900],
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.neutral[700]}`,
          padding: spacing.md,
        }}
      >
        <Typography
          sx={{
            fontSize: typography.fontSize.xxl,
            fontWeight: typography.fontWeights.bold,
            fontFamily: typography.fontFamily,
            color: colors.neutral[50],
          }}
        >
          Swap tokens instantly
        </Typography>
        <Skeleton 
          variant="circular" 
          width={40} 
          height={40} 
          sx={{ bgcolor: colors.neutral[700] }} 
        />
      </Box>

      {/* Main Content Section */}
      <Box
        sx={{
          display: "flex",
          gap: spacing.xl,
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "stretch",
        }}
      >
        {/* Swap Form Section */}
        <Box sx={{ flex: 1, position: "relative", width: "100%" }}>
          <Skeleton 
            variant="rounded" 
            height={86} 
            sx={{ 
              bgcolor: colors.neutral[800],
              borderRadius: borderRadius.lg 
            }} 
          />
          <Skeleton 
            variant="rounded" 
            height={36} 
            sx={{ 
              mt: spacing.sm, 
              bgcolor: colors.neutral[800],
              borderRadius: borderRadius.md 
            }} 
          />
          <Skeleton 
            variant="rounded" 
            height={86} 
            sx={{ 
              mt: spacing.sm, 
              bgcolor: colors.neutral[800],
              borderRadius: borderRadius.lg 
            }} 
          />
          <Skeleton 
            variant="rounded" 
            height={56} 
            sx={{ 
              mt: spacing.sm, 
              bgcolor: colors.neutral[800],
              borderRadius: borderRadius.lg 
            }} 
          />
        </Box>

        {/* Swap Details Section */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.neutral[700]}`,
            background: colors.neutral[900],
          }}
        >
          <Typography
            sx={{
              fontWeight: typography.fontWeights.bold,
              fontSize: typography.fontSize.xl,
              fontFamily: typography.fontFamily,
              marginBottom: spacing.md,
              color: colors.neutral[50],
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
              <Typography sx={listItemContentStyle}>
                <Skeleton 
                  variant="text" 
                  width={100} 
                  sx={{ bgcolor: colors.neutral[700] }} 
                />
              </Typography>
            </ListItem>
            <ListItem sx={listItemContainer}>
              <Typography sx={listItemNameStyle}>Protocol fee</Typography>
              <Typography sx={listItemContentStyle}>
                <Skeleton 
                  variant="text" 
                  width={80} 
                  sx={{ bgcolor: colors.neutral[700] }} 
                />
              </Typography>
            </ListItem>
            <ListItem sx={listItemContainer}>
              <Typography sx={listItemNameStyle}>Route</Typography>
              <Typography sx={listItemContentStyle}>
                <Skeleton 
                  variant="text" 
                  width={120} 
                  sx={{ bgcolor: colors.neutral[700] }} 
                />
              </Typography>
            </ListItem>
            <ListItem sx={listItemContainer}>
              <Typography sx={listItemNameStyle}>Slippage tolerance</Typography>
              <Typography sx={listItemContentStyle}>
                <Skeleton 
                  variant="text" 
                  width={60} 
                  sx={{ bgcolor: colors.neutral[700] }} 
                />
              </Typography>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Swap;
