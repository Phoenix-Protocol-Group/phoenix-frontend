import React from "react";
import { Box, Typography } from "@mui/material";
import { ArrowDownward, SwapVert } from "@mui/icons-material";
import { CollectionsOverviewActiveSort } from "@phoenix-protocol/types";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

function convertToCamelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+(\w)/g, (_, match) => match.toUpperCase());
}

const CollectionsOverviewHeader = ({
  label,
  active,
  handleSort,
}: {
  label: string;
  active: "asc" | "desc" | false;
  handleSort(column: string): void;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      p: spacing.xs,
      borderRadius: borderRadius.sm,
      transition: "all 0.2s ease",
      "&:hover": {
        background: `linear-gradient(135deg, ${colors.primary.main}10 0%, ${colors.primary.dark}05 100%)`,
        "& .header-text": {
          color: colors.neutral[100],
        },
        "& .header-icon": {
          color: colors.primary.main,
        },
      },
    }}
    onClick={() => {
      handleSort(convertToCamelCase(label));
    }}
  >
    {label === "collection" && (
      <Typography
        className="header-text"
        sx={{
          fontSize: typography.fontSize.xs,
          lineHeight: 1.4,
          fontWeight: typography.fontWeights.bold,
          textTransform: "uppercase",
          color: colors.neutral[400],
          letterSpacing: "0.5px",
          mr: spacing.sm,
          transition: "color 0.2s ease",
        }}
      >
        #
      </Typography>
    )}
    <Typography
      className="header-text"
      sx={{
        fontSize: typography.fontSize.xs,
        lineHeight: 1.4,
        fontWeight: typography.fontWeights.bold,
        textTransform: "uppercase",
        color: active ? colors.neutral[200] : colors.neutral[400],
        letterSpacing: "0.5px",
        mr: spacing.xs,
        transition: "color 0.2s ease",
      }}
    >
      {label}
    </Typography>
    {active ? (
      <ArrowDownward
        className="header-icon"
        sx={{
          fontSize: "14px",
          color: colors.primary.main,
          transform: active === "desc" ? "rotate(180deg)" : "none",
          transition: "all 0.2s ease",
        }}
      />
    ) : (
      <SwapVert
        className="header-icon"
        sx={{
          fontSize: "14px",
          color: colors.neutral[500],
          opacity: 0,
          transition: "all 0.2s ease",
          ".MuiBox-root:hover &": {
            opacity: 1,
            color: colors.neutral[400],
          },
        }}
      />
    )}
  </Box>
);

export default CollectionsOverviewHeader;
