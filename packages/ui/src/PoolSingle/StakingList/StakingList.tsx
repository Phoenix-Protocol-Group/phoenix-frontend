import React from "react";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { StakingListEntry as Entry } from "@phoenix-protocol/types";
import { motion } from "framer-motion";
import { ArrowBack } from "@mui/icons-material";

/**
 * StakingEntry Component
 * Renders an individual staking entry.
 */
const StakingEntry = ({ entry }: { entry: Entry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: "12px",
          background: "var(--neutral-900, #171717)", // Adjusted background
          border: "1px solid var(--neutral-700, #404040)", // Adjusted border
          mb: 2,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6} md={3} display="flex" alignItems="center">
            <Box
              component="img"
              src="/cryptoIcons/poolIcon.png"
              alt="Pool Icon"
              sx={{ width: "32px", height: "32px", mr: 2, opacity: 0.7 }} // Adjusted opacity
            />
            <Typography
              sx={{
                color: "var(--neutral-50, #FAFAFA)",
                fontSize: "14px",
                fontWeight: 500,
              }} // Adjusted color and weight
            >
              {entry.title}
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography
              sx={{ color: "var(--neutral-300, #D4D4D4)", fontSize: "12px" }}
            >
              {" "}
              {/* Adjusted color and size */}
              {entry.apr} APR
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography
              sx={{ color: "var(--neutral-300, #D4D4D4)", fontSize: "12px" }}
            >
              {" "}
              {/* Adjusted color and size */}
              Locked: {entry.lockedPeriod}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography
              sx={{ color: "var(--neutral-300, #D4D4D4)", fontSize: "12px" }}
            >
              {" "}
              {/* Adjusted color and size */}
              {entry.amount.tokenAmount} (${entry.amount.tokenValueInUsd})
            </Typography>
          </Grid>
          <Grid item xs={12} md={2} display="flex" justifyContent="flex-end">
            <IconButton
              onClick={entry.onClick}
              sx={{
                color: "var(--neutral-300, #D4D4D4)",
                borderRadius: "12px",
                border: "1px solid var(--neutral-700, #404040)",
                background: "transparent",
                transition: "all 0.2s",
                "&:hover": {
                  background: "rgba(249, 115, 22, 0.15)",
                  color: "#F97316",
                },
                display: "flex",
                alignItems: "center",
                gap: 0.5, // Adjusted gap
                padding: "6px 12px", // Adjusted padding
              }}
            >
              <ArrowBack sx={{ fontSize: "1rem" }} /> {/* Adjusted size */}
              <Typography
                sx={{
                  color: "inherit",
                  fontSize: "0.875rem", // Adjusted font size
                }}
              >
                Unstake
              </Typography>
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

/**
 * StakingList Component
 * Renders a list of staking entries with a header.
 */
const StakingList = ({ entries }: { entries: Entry[] }) => {
  return (
    <Box>
      {/* Header */}
      <Typography
        sx={{
          color: "var(--neutral-50, #FAFAFA)", // Adjusted color
          fontSize: "24px",
          fontWeight: 700,
          mb: 2,
        }}
      >
        Your Staked Assets
      </Typography>
      {/* List */}
      {entries.length > 0 ? (
        entries.map((entry, index) => (
          <StakingEntry entry={entry} key={index} />
        ))
      ) : (
        <Typography
          sx={{
            color: "var(--neutral-300, #D4D4D4)", // Adjusted color
            fontSize: "14px",
            textAlign: "center",
            pt: 2,
          }}
        >
          It looks like you haven't staked yet.
        </Typography>
      )}
    </Box>
  );
};

export default StakingList;
