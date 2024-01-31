import React from "react";
import { Box, Typography } from "@mui/material";
import { ArrowDownward, SwapVert } from "@mui/icons-material";

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
        fontSize: "10px",
        lineHeight: "200%",
        fontWeight: "700",
        textTransform: "uppercase",
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
          }}
        />
      ) : (
        <SwapVert sx={{ fontSize: "14px", opacity: "0.6" }} />
      ))}
  </Box>
);

export default TransactionHeader;
