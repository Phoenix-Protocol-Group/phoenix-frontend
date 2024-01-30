import React from "react";
import { Box, Typography } from "@mui/material";
import { ArrowDownward, SwapVert } from "@mui/icons-material";

const TransactionHeader = ({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
    }}
  >
    <Typography
      sx={{
        fontSize: "10px",
        lineHeight: "200%",
        fontWeight: "700",
        textTransform: "uppercase",
        opacity: active ? "1" : "0.6",
        mr: 0.5,
      }}
    >
      {label}
    </Typography>
    {active ? (
      <ArrowDownward sx={{ fontSize: "14px" }} />
    ) : (
      <SwapVert sx={{ fontSize: "14px", opacity: "0.6" }} />
    )}
  </Box>
);

export default TransactionHeader;
