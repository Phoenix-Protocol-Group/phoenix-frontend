import React from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import TopCollectionsHeader from "./TopCollectionsHeader";
import TopCollectionsEntry from "./TopCollectionsEntry";
import { TopCollectionsProps } from "@phoenix-protocol/types";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  cardStyles,
} from "../../../Theme/styleConstants";

const TopCollections = (props: TopCollectionsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box
        sx={{
          ...cardStyles.base,
          p: { xs: spacing.md, md: spacing.lg },
          background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${colors.primary.main}03 0%, ${colors.primary.dark}02 100%)`,
            borderRadius: borderRadius.lg,
            pointerEvents: "none",
          },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: spacing.md,
            mb: spacing.lg,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              color: colors.neutral[50],
              fontFamily: typography.fontFamily,
              fontSize: {
                xs: typography.fontSize.xl,
                md: typography.fontSize.xxl,
              },
              fontWeight: typography.fontWeights.bold,
              lineHeight: 1.2,
              background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[300]} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Top Collections
          </Typography>

          {/* Filter Controls */}
          <Box
            sx={{
              display: "flex",
              gap: spacing.sm,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Currency Toggle */}
            <Box sx={{ display: "flex", gap: spacing.xs }}>
              {["crypto", "usd"].map((currency) => (
                <Box
                  key={currency}
                  onClick={() =>
                    props.setActiveCurrency(currency as "crypto" | "usd")
                  }
                  sx={{
                    px: spacing.md,
                    py: spacing.sm,
                    borderRadius: borderRadius.md,
                    cursor: "pointer",
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    transition: "all 0.3s ease",
                    ...(props.activeCurrency === currency
                      ? {
                          background: `linear-gradient(135deg, ${colors.primary.main}25 0%, ${colors.primary.dark}15 100%)`,
                          border: `1px solid ${colors.primary.main}80`,
                          color: colors.neutral[50],
                          boxShadow: `0 0 20px ${colors.primary.main}40`,
                        }
                      : {
                          background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
                          border: `1px solid ${colors.neutral[700]}`,
                          color: colors.neutral[400],
                          "&:hover": {
                            border: `1px solid ${colors.primary.main}60`,
                            color: colors.neutral[300],
                          },
                        }),
                  }}
                >
                  {currency.toUpperCase()}
                </Box>
              ))}
            </Box>

            {/* Time Period Toggle */}
            <Box sx={{ display: "flex", gap: spacing.xs }}>
              {["6h", "1d", "7d", "30d"].map((period) => (
                <Box
                  key={period}
                  onClick={() =>
                    props.setActiveTime(period as "6h" | "1d" | "7d" | "30d")
                  }
                  sx={{
                    px: spacing.md,
                    py: spacing.sm,
                    borderRadius: borderRadius.md,
                    cursor: "pointer",
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeights.bold,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    transition: "all 0.3s ease",
                    ...(props.activeTime === period
                      ? {
                          background: `linear-gradient(135deg, ${colors.primary.main}25 0%, ${colors.primary.dark}15 100%)`,
                          border: `1px solid ${colors.primary.main}80`,
                          color: colors.neutral[50],
                          boxShadow: `0 0 20px ${colors.primary.main}40`,
                        }
                      : {
                          background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
                          border: `1px solid ${colors.neutral[700]}`,
                          color: colors.neutral[400],
                          "&:hover": {
                            border: `1px solid ${colors.primary.main}60`,
                            color: colors.neutral[300],
                          },
                        }),
                  }}
                >
                  {period.toUpperCase()}
                </Box>
              ))}
            </Box>

            {/* View All Button */}
            <Box
              onClick={props.onViewAllClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: spacing.xs,
                px: spacing.md,
                py: spacing.sm,
                borderRadius: borderRadius.md,
                cursor: "pointer",
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeights.bold,
                background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
                border: `1px solid ${colors.neutral[700]}`,
                color: colors.neutral[300],
                transition: "all 0.3s ease",
                "&:hover": {
                  border: `1px solid ${colors.primary.main}60`,
                  color: colors.neutral[50],
                  background: `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.primary.dark}10 100%)`,
                },
              }}
            >
              View All
              <ArrowRightAltIcon sx={{ fontSize: "16px" }} />
            </Box>
          </Box>
        </Box>

        {/* Table Header - Desktop only */}
        {!isMobile && (
          <Box
            sx={{
              px: { xs: spacing.md, md: spacing.lg },
              py: spacing.md,
              borderBottom: `1px solid ${colors.neutral[800]}`,
              background: `linear-gradient(135deg, ${colors.neutral[900]}20 0%, ${colors.neutral[800]}20 100%)`,
              borderRadius: borderRadius.md,
              mb: spacing.md,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: `linear-gradient(90deg, transparent, ${colors.primary.main}50, transparent)`,
              },
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <TopCollectionsHeader
                  handleSort={props.handleSort}
                  label="collection"
                  active={
                    props.activeSort.column === "collection"
                      ? props.activeSort.direction
                      : false
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TopCollectionsHeader
                  handleSort={props.handleSort}
                  label="floor price"
                  active={
                    props.activeSort.column === "floorPrice"
                      ? props.activeSort.direction
                      : false
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TopCollectionsHeader
                  handleSort={props.handleSort}
                  label="best offer"
                  active={
                    props.activeSort.column === "bestOffer"
                      ? props.activeSort.direction
                      : false
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TopCollectionsHeader
                  handleSort={props.handleSort}
                  label="volume"
                  active={
                    props.activeSort.column === "volume"
                      ? props.activeSort.direction
                      : false
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TopCollectionsHeader
                  handleSort={props.handleSort}
                  label="owners"
                  active={
                    props.activeSort.column === "owners"
                      ? props.activeSort.direction
                      : false
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <TopCollectionsHeader
                  handleSort={props.handleSort}
                  label="for sale"
                  active={
                    props.activeSort.column === "forSale"
                      ? props.activeSort.direction
                      : false
                  }
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Collections List */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            overflowX: { xs: "auto", md: "visible" },
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: colors.neutral[800],
              borderRadius: borderRadius.md,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: colors.primary.main,
              borderRadius: borderRadius.md,
              "&:hover": {
                backgroundColor: colors.primary.light,
              },
            },
            // Styles for Firefox
            scrollbarWidth: "thin",
            scrollbarColor: `${colors.primary.main} ${colors.neutral[800]}`,
          }}
        >
          <Box sx={{ minWidth: { xs: "700px", md: "auto" } }}>
            {props.entries.length ? (
              props.entries.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <TopCollectionsEntry
                    _key={index}
                    _onClick={props.onEntryClick}
                    {...entry}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: spacing.xl,
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${colors.neutral[800]} 0%, ${colors.neutral[700]} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: spacing.md,
                      border: `2px solid ${colors.primary.main}30`,
                    }}
                  >
                    <Typography sx={{ fontSize: "24px" }}>📊</Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: colors.neutral[50],
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeights.semiBold,
                      mb: spacing.xs,
                    }}
                  >
                    No Collections Found
                  </Typography>

                  <Typography
                    sx={{
                      color: colors.neutral[400],
                      fontSize: typography.fontSize.sm,
                      maxWidth: "400px",
                      lineHeight: 1.5,
                    }}
                  >
                    Collections will appear here once the marketplace goes live.
                    Stay tuned for exciting NFT collections!
                  </Typography>
                </Box>
              </motion.div>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default TopCollections;
