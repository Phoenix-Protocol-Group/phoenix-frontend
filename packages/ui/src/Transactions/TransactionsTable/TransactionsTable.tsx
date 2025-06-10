import React from "react";
import { Box, Grid, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import FilterMenu from "./FilterMenu";
import { TransactionsTableProps } from "@phoenix-protocol/types";
import TransactionEntry from "./TransactionEntry";
import TransactionHeader from "./TransactionsHeader";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  cardStyles,
} from "../../Theme/styleConstants";

const customSpacing = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
};

const TransactionsTable = ({
  activeView,
  setActiveView,
  loggedIn,
  activeFilters,
  applyFilters,
  handleSort,
  activeSort,
  entries,
}: TransactionsTableProps) => {
  const [renderedEntries, setRenderedEntries] = React.useState<number>(0);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  // Render entries one by one with a delay
  React.useEffect(() => {
    if (entries.length > 0) {
      const interval = setInterval(() => {
        setRenderedEntries((prevCount) =>
          prevCount < entries.length ? prevCount + 1 : prevCount
        );
      }, 200);

      return () => clearInterval(interval);
    }
  }, [entries]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Box
        sx={{
          ...cardStyles.base,
          p: { xs: spacing.md, md: spacing.lg },
          background: `linear-gradient(145deg, ${colors.neutral[800]}80 0%, ${colors.neutral[850]}60 100%)`,
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
            bottom: 0,
            background: `linear-gradient(135deg, ${colors.primary.main}03 0%, ${colors.primary.dark}02 100%)`,
            borderRadius: borderRadius.lg,
            pointerEvents: "none",
          },
        }}
      >
        {/* Header with Tabs and Filter */}
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
          <Box
            sx={{
              display: "flex",
              gap: spacing.sm,
              flexWrap: "wrap",
            }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Box
                sx={{
                  display: "flex",
                  minWidth: "80px",
                  height: "40px",
                  padding: `${spacing.sm} ${spacing.md}`,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: borderRadius.md,
                  cursor: "pointer",
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                  transition: "all 0.3s ease",
                  ...(activeView === "all"
                    ? {
                        background: `linear-gradient(135deg, ${colors.primary.main}25 0%, ${colors.primary.dark}15 100%)`,
                        border: `1px solid ${colors.primary.main}80`,
                        color: colors.neutral[50],
                        boxShadow: `0 0 20px ${colors.primary.main}40`,
                      }
                    : {
                        background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[850]} 100%)`,
                        border: `1px solid ${colors.neutral[700]}`,
                        color: colors.neutral[300],
                        "&:hover": {
                          background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.dark}08 100%)`,
                          border: `1px solid ${colors.primary.main}30`,
                          color: colors.neutral[100],
                        },
                      }),
                }}
                onClick={() => setActiveView("all")}
              >
                All
              </Box>
            </motion.div>

            <Tooltip
              title={
                loggedIn
                  ? undefined
                  : "Connect wallet to see personal transactions"
              }
              arrow
            >
              <motion.div
                whileHover={{ scale: loggedIn ? 1.02 : 1 }}
                whileTap={{ scale: loggedIn ? 0.98 : 1 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    minWidth: "80px",
                    height: "40px",
                    padding: `${spacing.sm} ${spacing.md}`,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: borderRadius.md,
                    cursor: loggedIn ? "pointer" : "not-allowed",
                    fontFamily: typography.fontFamily,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.medium,
                    transition: "all 0.3s ease",
                    opacity: loggedIn ? 1 : 0.6,
                    ...(activeView === "personal"
                      ? {
                          background: `linear-gradient(135deg, ${colors.primary.main}25 0%, ${colors.primary.dark}15 100%)`,
                          border: `1px solid ${colors.primary.main}80`,
                          color: colors.neutral[50],
                          boxShadow: `0 0 20px ${colors.primary.main}40`,
                        }
                      : {
                          background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[850]} 100%)`,
                          border: `1px solid ${colors.neutral[700]}`,
                          color: colors.neutral[300],
                          ...(loggedIn && {
                            "&:hover": {
                              background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.primary.dark}08 100%)`,
                              border: `1px solid ${colors.primary.main}30`,
                              color: colors.neutral[100],
                            },
                          }),
                        }),
                  }}
                  onClick={() => (loggedIn ? setActiveView("personal") : null)}
                >
                  Personal
                </Box>
              </motion.div>
            </Tooltip>
          </Box>

          <FilterMenu
            activeFilters={activeFilters}
            applyFilters={applyFilters}
          />
        </Box>
        {/* Desktop Header */}
        {!isMobile && (
          <Box
            sx={{
              p: spacing.md,
              borderRadius: borderRadius.md,
              background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
              border: `1px solid ${colors.neutral[700]}`,
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
            <Grid container>
              <Grid item xs={2}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="Date & Time"
                  active={
                    activeSort.column === "date" ? activeSort.direction : false
                  }
                />
              </Grid>
              <Grid item xs={5}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="Swap Details"
                  active={
                    activeSort.column === "asset" ? activeSort.direction : false
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="Trade Value (USD)"
                  active={
                    activeSort.column === "tradeValue"
                      ? activeSort.direction
                      : false
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="Transaction ID"
                  active={
                    activeSort.column === "actions"
                      ? activeSort.direction
                      : false
                  }
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Transactions List */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {entries.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TransactionEntry {...entry} isMobile={isMobile} />
            </motion.div>
          ))}

          {/* Empty State */}
          {entries.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: spacing.xxl,
                px: spacing.lg,
                textAlign: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.primary.main}20, ${colors.primary.dark}10)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: spacing.md,
                    border: `2px solid ${colors.primary.main}30`,
                  }}
                >
                  <Typography sx={{ fontSize: "24px" }}>📊</Typography>
                </Box>
              </motion.div>

              <Typography
                sx={{
                  color: colors.neutral[50],
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeights.semiBold,
                  mb: spacing.xs,
                }}
              >
                {activeView === "personal"
                  ? "No Personal Transactions"
                  : "No Transactions Found"}
              </Typography>

              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontSize: typography.fontSize.sm,
                  maxWidth: "400px",
                  lineHeight: 1.5,
                }}
              >
                {activeView === "personal"
                  ? "It looks like you haven't made any transactions yet. Start trading to see your transaction history here."
                  : "No transactions match your current filters. Try adjusting your search criteria or check back later."}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export { TransactionsTable };
