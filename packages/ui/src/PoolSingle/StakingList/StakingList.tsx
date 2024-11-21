import React from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { StakingListEntry as Entry } from "@phoenix-protocol/types";
import ConstructionIcon from "@mui/icons-material/Construction";
import { motion } from "framer-motion";

// Define common typography style for consistent styling
const typoStyle = {
  color: "#FFF",
  fontSize: "1rem",
  fontWeight: 700,
};

/**
 * StakingEntry Component
 * Renders an individual staking entry.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Entry} props.entry - The staking entry data.
 * @param {boolean} props.mobile - Whether the component is displayed on a mobile device.
 */
const StakingEntry = ({ entry, mobile }: { entry: Entry; mobile: boolean }) => {
  return (
    <Grid
      container
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        borderRadius: "0.5rem",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        padding: "1rem",
        marginBottom: 1,
      }}
    >
      <Grid item xs={8} md={3}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box
            component="img"
            width={32}
            maxWidth={"100%"}
            src="/cryptoIcons/poolIcon.png"
            alt="Pool Icon"
          />
          <Typography sx={typoStyle}>{entry.title}</Typography>
        </Box>
      </Grid>
      <Grid item xs={4} md={2}>
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography sx={typoStyle}>
            {entry.apr} {mobile && "APR"}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} md={2}>
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography sx={typoStyle}>
            {mobile && "Locked: "}
            {entry.lockedPeriod}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} md={4}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography sx={typoStyle}>{entry.amount.tokenAmount}</Typography>
          <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
            ${entry.amount.tokenValueInUsd}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={1} sx={{ display: "flex" }}>
        <IconButton
          aria-label="Manage Entry"
          sx={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            mr: 2,
          }}
          onClick={entry.onClick}
          component={motion.div}
          whileHover={{ scale: 1.1 }}
        >
          <Box component="img" src="/sliders.svg" alt="Manage Icon" />
          {mobile && (
            <Typography sx={{ opacity: "0.7", fontSize: "0.75rem" }}>
              Manage
            </Typography>
          )}
        </IconButton>
      </Grid>
    </Grid>
  );
};

/**
 * StakingList Component
 * Renders a list of staking entries.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Entry[]} props.entries - The list of staking entries.
 */
const StakingList = ({ entries }: { entries: Entry[] }) => {
  const theme = useTheme();
  const largerThenSm = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box>
      {largerThenSm && (
        <Grid container sx={{ px: 2, pb: 1 }}>
          <Grid item xs={3}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
              Asset
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>APR</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
              Days Staked
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
              Amount
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography sx={{ ...typoStyle, fontWeight: 400 }}>
              Unbond
            </Typography>
          </Grid>
        </Grid>
      )}
      {entries.length > 0 ? (
        entries.map((entry, index) => (
          <StakingEntry mobile={!largerThenSm} entry={entry} key={index} />
        ))
      ) : (
        <Typography
          sx={{
            color: "#FFF",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pt: 1,
          }}
        >
          It looks like you haven't staked yet.
        </Typography>
      )}
    </Box>
  );
};

export default StakingList;
