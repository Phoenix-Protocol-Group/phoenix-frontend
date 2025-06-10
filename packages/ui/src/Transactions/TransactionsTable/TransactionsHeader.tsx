import React from "react";
import { Box, Typography } from "@mui/material";
import { ArrowDownward, SwapVert } from "@mui/icons-material";
import { colors, typography, spacing } from "../../Theme/styleConstants";

function mapLabelToColumn(label: string): string {
  switch (label) {
    case "Date & Time":
      return "date";
    case "Swap Details":
      return "asset";
    case "Trade Value (USD)":
      return "tradeValue";
    case "Transaction ID":
      return "actions"; // This should not be sortable, but keeping for consistency
    default:
      return label.toLowerCase().replace(/\s+/g, "");
  }
}

const TransactionHeader = ({
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
      cursor:
        label !== "Actions" && label !== "Transaction ID"
          ? "pointer"
          : "default",
      p: spacing.xs,
      borderRadius: "6px",
      transition: "all 0.2s ease",
      "&:hover":
        label !== "Actions" && label !== "Transaction ID"
          ? {
              background: `linear-gradient(135deg, ${colors.primary.main}10 0%, ${colors.primary.dark}05 100%)`,
              "& .header-text": {
                color: colors.neutral[100],
              },
              "& .header-icon": {
                color: colors.primary.main,
              },
            }
          : {},
    }}
    onClick={() => {
      if (label !== "Actions" && label !== "Transaction ID") {
        handleSort(mapLabelToColumn(label));
      }
    }}
  >
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
    {label !== "Actions" &&
      label !== "Transaction ID" &&
      (active ? (
        <ArrowDownward
          className="header-icon"
          sx={{
            fontSize: "14px",
            transform: active === "desc" ? "rotate(180deg)" : "none",
            transition: "all 0.2s ease",
            color: colors.primary.main,
          }}
        />
      ) : (
        <SwapVert
          className="header-icon"
          sx={{
            fontSize: "14px",
            color: colors.neutral[500],
            opacity: 0.6,
            transition: "all 0.2s ease",
          }}
        />
      ))}
  </Box>
);

export default TransactionHeader;
