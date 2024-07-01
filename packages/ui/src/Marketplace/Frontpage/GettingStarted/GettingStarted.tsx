import React from "react";
import { ArrowRightAlt } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import GettingStartedCard from "./GettingStartedCard";
import { GettingStartedCardProps, GettingStartedProps } from "@phoenix-protocol/types";

const GettingStarted = (props: GettingStartedProps) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: "#FFF",
            fontFamily: "Ubuntu",
            fontSize: "2rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            flex: 1,
          }}
        >
          NFTs Categories
        </Typography>
        <Box
          sx={{
            display: "flex",
            height: "2.3125rem",
            padding: "1.125rem 0.7rem 1.125rem 1rem",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "1rem",
            cursor: "pointer",
            background:
              "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
            color: "#FFF",
            textAlign: "center",
            fontSize: "0.625rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "1.25rem",
          }}
          onClick={props.onViewAllClick}
        >
          <Box mr={0.5} whiteSpace="nowrap">
            View All
          </Box>
          <ArrowRightAlt sx={{ fontSize: "16px" }} />
        </Box>
      </Box>
      <Grid container spacing={2}>
        {props.entries.map((item: GettingStartedCardProps, index: number) => (
          <Grid item xs={12} md={4}>
            <GettingStartedCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GettingStarted;
