import React from "react";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { StakingListEntry as Entry } from "@phoenix-protocol/types";
import { motion } from "framer-motion";
import { ArrowBack } from "@mui/icons-material";
import { colors } fro          <Typography
            sx={{
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              fontWeight: 700,
              background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Ubuntu, sans-serif",
              position: "relative",
              zIndex: 1,
            }}
          >
            Your Staked Assets
          </Typography>styleConstants";

/**
 * StakingEntry Component
 * Renders an individual staking entry.
 */
const StakingEntry = ({ entry }: { entry: Entry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: "20px",
          background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          backdropFilter: "blur(20px)",
          mb: 3,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              `linear-gradient(90deg, transparent, rgba(${colors.neutral[600].slice(1)}, 0.4), transparent)`,
          },
          "&:hover": {
            border: `1px solid ${colors.primary.main}`,
            background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
            boxShadow: `0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px ${colors.primary.main}`,
          },
        }}
      >
        {/* Glow effect */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background:
              `radial-gradient(ellipse at center top, ${colors.neutral[700]}1A 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <Grid
          container
          alignItems="center"
          spacing={3}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid item xs={12} md={3} display="flex" alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `2px solid ${colors.neutral[600]}`,
                background:
                  `linear-gradient(135deg, ${colors.neutral[800]} 0%, ${colors.neutral[700]} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <Box
                component="img"
                src="/cryptoIcons/poolIcon.png"
                alt="Pool Icon"
                sx={{ width: "24px", height: "24px" }}
              />
            </Box>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "Ubuntu, sans-serif",
              }}
            >
              {entry.title}
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography
              sx={{
                color: `${colors.neutral[400]}`,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "Ubuntu, sans-serif",
                mb: 0.5,
              }}
            >
              APR
            </Typography>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: "1rem",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {entry.apr}
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography
              sx={{
                color: `${colors.neutral[400]}`,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "Ubuntu, sans-serif",
                mb: 0.5,
              }}
            >
              Locked
            </Typography>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: "1rem",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {entry.lockedPeriod}
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "Ubuntu, sans-serif",
                mb: 0.5,
              }}
            >
              Amount
            </Typography>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: "1rem",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {entry.amount.tokenAmount}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "0.875rem",
                fontFamily: "Inter, sans-serif",
              }}
            >
              ${entry.amount.tokenValueInUsd}
            </Typography>
          </Grid>

          <Grid item xs={12} md={2} display="flex" justifyContent="flex-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={entry.onClick}
                sx={{
                  color: "#FFFFFF",
                  borderRadius: "16px",
                  border: `1px solid ${colors.neutral[600]}`,
                  background:
                    `linear-gradient(135deg, ${colors.neutral[800]} 0%, ${colors.neutral[700]} 100%)`,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  px: 2,
                  py: 1,
                  "&:hover": {
                    background:
                      `linear-gradient(135deg, ${colors.primary.main}33 0%, ${colors.primary.main}22 100%)`,
                    border: `1px solid ${colors.primary.main}`,
                    boxShadow: `0 8px 32px ${colors.primary.main}33`,
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ArrowBack sx={{ fontSize: "1rem" }} />
                <Typography
                  sx={{
                    color: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    fontFamily: "Ubuntu, sans-serif",
                  }}
                >
                  Unstake
                </Typography>
              </IconButton>
            </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box>
        {/* Enhanced Header */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: "20px",
            background:
              `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
            border: `1px solid ${colors.neutral[700]}`,
            backdropFilter: "blur(20px)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                `linear-gradient(90deg, transparent, ${colors.neutral[600]}66, transparent)`,
            },
          }}
        >
          {/* Glow effect */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              background:
                `radial-gradient(ellipse at center top, ${colors.neutral[700]}1A 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              fontWeight: 700,
              background: `linear-gradient(135deg, ${colors.neutral[200]} 0%, ${colors.neutral[400]} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Ubuntu, sans-serif",
              position: "relative",
              zIndex: 1,
            }}
          >
            Your Staked Assets
          </Typography>
          <Typography
            sx={{
              mt: 1,
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              position: "relative",
              zIndex: 1,
            }}
          >
            Track and manage your staked liquidity positions
          </Typography>
        </Box>

        {/* Stakes List */}
        {entries.length > 0 ? (
          <Box>
            {entries.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <StakingEntry entry={entry} />
              </motion.div>
            ))}
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                p: 4,
                borderRadius: "20px",
                background:
                  `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
                border: `1px dashed ${colors.neutral[600]}`,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(251, 146, 60, 0.1) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                  border: "2px solid rgba(249, 115, 22, 0.2)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: `${colors.neutral[400]}`,
                  }}
                >
                  📊
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  mb: 1,
                  fontFamily: "Ubuntu, sans-serif",
                }}
              >
                No Staked Assets
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "0.875rem",
                  fontFamily: "Inter, sans-serif",
                  maxWidth: "300px",
                  mx: "auto",
                }}
              >
                Start earning rewards by staking your liquidity tokens above
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default StakingList;
