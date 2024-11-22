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
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          mb: 2,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6} md={3} display="flex" alignItems="center">
            <Box
              component="img"
              src="/cryptoIcons/poolIcon.png"
              alt="Pool Icon"
              sx={{ width: "32px", height: "32px", mr: 2 }}
            />
            <Typography
              sx={{ color: "#FFF", fontSize: "14px", fontWeight: 700 }}
            >
              {entry.title}
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography sx={{ color: "#FFF", fontSize: "14px" }}>
              {entry.apr} APR
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography sx={{ color: "#FFF", fontSize: "14px" }}>
              Locked: {entry.lockedPeriod}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography sx={{ color: "#FFF", fontSize: "14px" }}>
              {entry.amount.tokenAmount} (${entry.amount.tokenValueInUsd})
            </Typography>
          </Grid>
          <Grid item xs={12} md={2} display="flex" justifyContent="flex-end">
            <IconButton
              onClick={entry.onClick}
              sx={{
                color: "#FFF",
                borderRadius: "12px",
                background: "transparent",
                transition: "all 0.2s",
                "&:hover": {
                  background: "rgba(226, 73, 27, 0.15)",
                  color: "#E2621B",
                },
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <ArrowBack />
              <Typography
                sx={{
                  color: "inherit",
                  fontSize: "14px",
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
          color: "#FFF",
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
            color: "#FFF",
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
