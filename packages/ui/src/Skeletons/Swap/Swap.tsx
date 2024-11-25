import { Box, Skeleton, Typography, List, ListItem } from "@mui/material";
import React from "react";

const listItemContainer = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
};

const listItemNameStyle = {
  color: "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
  fontSize: "14px",
  lineHeight: "140%",
  marginBottom: 0,
};

const listItemContentStyle = {
  color: "#FFF",
  fontSize: "14px",
  fontWeight: "700",
  lineHeight: "140%",
};

export const Swap = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "32px",
            fontWeight: "700",
          }}
        >
          Swap tokens instantly
        </Typography>
        <Skeleton variant="circular" width={40} height={40} />
      </Box>

      {/* Main Content Section */}
      <Box
        sx={{
          display: "flex",
          gap: "24px",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "stretch",
        }}
      >
        {/* Swap Form Section */}
        <Box sx={{ flex: 1, position: "relative", width: "100%" }}>
          <Skeleton variant="rounded" height={86} />
          <Skeleton variant="rounded" height={36} sx={{ mt: 2 }} />
          <Skeleton variant="rounded" height={86} sx={{ mt: 2 }} />
          <Skeleton variant="rounded" height={56} sx={{ mt: 2 }} />
        </Box>

        {/* Swap Details Section */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid var(--Secondary-S4, #2C2C31)",
            background:
              "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
          }}
        >
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "20px",
              marginBottom: "16px",
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
                <Skeleton variant="text" width={100} />
              </Typography>
            </ListItem>
            <ListItem sx={listItemContainer}>
              <Typography sx={listItemNameStyle}>Protocol fee</Typography>
              <Typography sx={listItemContentStyle}>
                <Skeleton variant="text" width={100} />
              </Typography>
            </ListItem>
            <ListItem sx={listItemContainer}>
              <Typography sx={listItemNameStyle}>Route</Typography>
              <Typography sx={listItemContentStyle}>
                <Skeleton variant="text" width={100} />
              </Typography>
            </ListItem>
            <ListItem sx={listItemContainer}>
              <Typography sx={listItemNameStyle}>Slippage tolerance</Typography>
              <Typography sx={listItemContentStyle}>
                <Skeleton variant="text" width={100} />
              </Typography>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Swap;
