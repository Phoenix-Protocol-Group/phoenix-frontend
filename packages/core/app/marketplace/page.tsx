"use client";

import { Box, Typography } from "@mui/material";

export default function page() {
  return (
    <Box
      sx={{
        mb: 1,
        pt: 1.2,
        width: "100%",
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: "24px",
          lineHeight: "28px",
          fontWeight: 700,
        }}
      >
        Marketplace
      </Typography>
    </Box>
  );
}
