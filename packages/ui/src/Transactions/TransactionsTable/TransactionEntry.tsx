import React from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import { ArrowRightAlt, ManageSearch } from "@mui/icons-material";
import { TransactionTableEntryProps } from "@phoenix-protocol/types";

const TransactionEntry = (props: TransactionTableEntryProps) => {
  const BoxStyle = {
    p: 2,
    borderRadius: "8px",
    border: "1px solid #2C2C31",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
  };

  return (
    <Box sx={{ ...BoxStyle, mb: 2 }}>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Box
            sx={{
              borderRadius: "16px",
              border:
                props.type === "Sent" ? "1px solid #F22" : "1px solid #5BFF22",
              background:
                props.type === "Sent"
                  ? "rgba(255, 34, 34, 0.20)"
                  : "rgba(91, 255, 34, 0.20)",
              color: props.type === "Sent" ? "#F22" : "#5BFF22",
              fontSize: "12px",
              py: 0.5,
              display: "inline-flex",
              width: "88px",
              justifyContent: "center",
            }}
          >
            {props.type}
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            {props.assets.map((asset, index) => (
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {asset.name}{" "}
                {index !== props.assets.length - 1 && (
                  <ArrowRightAlt sx={{ fontSize: "24px" }} />
                )}
              </Typography>
            ))}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "14px",
            }}
          >
            {props.tradeSize}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "14px",
              opacity: "0.6",
            }}
          >
            ${props.tradeValue}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "14px",
              opacity: "0.6",
            }}
          >
            {props.date}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton>
            <ManageSearch sx={{ fontSize: "20px" }} />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionEntry;