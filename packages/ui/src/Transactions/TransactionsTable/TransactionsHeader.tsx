import React from "react";
import { Box, Typography } from "@mui/material";
import { ArrowDownward, SwapVert } from "@mui/icons-material";
import { colors, typography } from "../../Theme/styleConstants";

function convertToCamelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+(\w)/g, (_, match) => match.toUpperCase());
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
      cursor: label !== "Actions" ? "pointer" : "default",
    }}
    onClick={() => {
      if (label !== "Actions") {
        handleSort(convertToCamelCase(label));
      }
    }}
  >
    <Typography
      sx={{
        fontSize: typography.fontSize.xs,
        lineHeight: "200%",
        fontWeight: typography.fontWeights.bold,
        textTransform: "uppercase",
        color: colors.neutral[300],
        opacity: active && label !== "Actions" ? "1" : "0.6",
        mr: 0.5,
      }}
    >
      {label}
    </Typography>
    {label !== "Actions" &&
      (active ? (
        <ArrowDownward
          sx={{
            fontSize: "14px",
            transform: active === "desc" ? "rotate(180deg)" : "none",
            color: colors.neutral[300],
          }}
        />
      ) : (
        <SwapVert
          sx={{
            fontSize: "14px",
            opacity: "0.6",
            color: colors.neutral[300],
          }}
        />
      ))}
  </Box>
);

export default TransactionHeader;
