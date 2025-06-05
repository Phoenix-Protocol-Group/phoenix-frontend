import React from "react";
import { Box, Grid, Tooltip, Typography, useMediaQuery } from "@mui/material"; // Import useMediaQuery
import { motion } from "framer-motion"; // Import Framer Motion
import FilterMenu from "./FilterMenu";
import { TransactionsTableProps } from "@phoenix-protocol/types";
import TransactionEntry from "./TransactionEntry";
import TransactionHeader from "./TransactionsHeader";
import { maxWidth } from "@mui/system";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

const customSpacing = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
};

const classes = {
  root: {
    marginTop: customSpacing.md,
    padding: `${customSpacing.md} ${customSpacing.md}`,
    borderRadius: "20px",
    background: `
      linear-gradient(135deg, rgba(23, 23, 23, 0.95) 0%, rgba(38, 38, 38, 0.85) 100%)
    `,
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(249, 115, 22, 0.2)",
    overflowX: "auto",
    boxShadow:
      "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(249, 115, 22, 0.1)",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(135deg, rgba(249, 115, 22, 0.03) 0%, rgba(234, 88, 12, 0.02) 100%)",
      borderRadius: "20px",
      pointerEvents: "none",
    },
  },
  tabUnselected: {
    display: "flex",
    width: "auto",
    minWidth: "80px",
    height: "40px",
    padding: `12px 20px`,
    justifyContent: "center",
    alignItems: "center",
    gap: "0.625rem",
    borderRadius: "12px",
    cursor: "pointer",
    color: "rgba(255, 255, 255, 0.7)",
    background: "rgba(23, 23, 23, 0.8)",
    backdropFilter: "blur(10px)",
    opacity: 0.9,
    textAlign: "center",
    fontFeatureSettings: "'clig' off, 'liga' off",
    fontFamily: typography.fontFamily,
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: typography.fontWeights.medium,
    lineHeight: "1.25rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(249, 115, 22, 0.15)",
      border: "1px solid rgba(249, 115, 22, 0.3)",
      color: "rgba(255, 255, 255, 0.9)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
    },
  },
  tabSelected: {
    display: "flex",
    minWidth: "80px",
    height: "40px",
    padding: `12px 20px`,
    justifyContent: "center",
    alignItems: "center",
    gap: "0.625rem",
    flex: "1 0 0",
    borderRadius: "12px",
    border: "1px solid rgba(249, 115, 22, 0.8)",
    background: `
      linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(234, 88, 12, 0.15) 100%)
    `,
    backdropFilter: "blur(10px)",
    color: "#FAFAFA",
    textAlign: "center",
    fontFeatureSettings: "'clig' off, 'liga' off",
    fontFamily: typography.fontFamily,
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: typography.fontWeights.bold,
    lineHeight: "1.25rem",
    boxShadow:
      "0 0 20px rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    animation: "glow 2s ease-in-out infinite alternate",
    "@keyframes glow": {
      "0%": {
        boxShadow:
          "0 0 20px rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
      "100%": {
        boxShadow:
          "0 0 30px rgba(249, 115, 22, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      },
    },
  },
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
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md")); // Check if the device is mobile

  // Render entries one by one with a delay
  React.useEffect(() => {
    if (entries.length > 0) {
      const interval = setInterval(() => {
        setRenderedEntries((prevCount) =>
          prevCount < entries.length ? prevCount + 1 : prevCount
        );
      }, 200); // Adjust the delay between each entry here (in milliseconds)

      return () => clearInterval(interval);
    }
  }, [entries]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      {/* @ts-ignore */}
      <Box sx={classes.root}>
        <Box
          sx={{
            display: "flex",
            marginBottom: customSpacing.md,
            minWidth: { md: "700px", xs: "100%" },
            justifyContent: "space-between",
          }}
        >
          <Box
            style={{
              display: "flex",
              gap: customSpacing.sm,
              justifyContent: "space-between",
            }}
          >
            <motion.div
              // @ts-ignore
              style={{
                ...classes.tabUnselected,
                ...(activeView === "all" ? classes.tabSelected : ""),
              }}
              onClick={() => setActiveView("all")}
              whileHover={{ scale: 1.05 }}
            >
              All
            </motion.div>
            <Tooltip
              title={
                loggedIn
                  ? undefined
                  : "Connect wallet to see personal transactions"
              }
            >
              <motion.div
                // @ts-ignore
                style={{
                  ...classes.tabUnselected,
                  ...(activeView === "personal" ? classes.tabSelected : ""),
                }}
                onClick={() => (loggedIn ? setActiveView("personal") : null)}
                whileHover={{ scale: 1.05 }}
              >
                Personal
              </motion.div>
            </Tooltip>
          </Box>
          <FilterMenu
            activeFilters={activeFilters}
            applyFilters={applyFilters}
          />
        </Box>
        {!isMobile && ( // Hide header on mobile
          <Box
            sx={{
              padding: `${customSpacing.md} ${customSpacing.md}`,
              borderRadius: "16px",
              background: `
                linear-gradient(135deg, rgba(23, 23, 23, 0.9) 0%, rgba(38, 38, 38, 0.7) 100%),
                radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.08) 0%, transparent 70%)
              `,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
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
                  "linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.5), transparent)",
              },
            }}
          >
            <Grid container>
              <Grid item xs={2}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="Date"
                  active={
                    activeSort.column === "tradeType"
                      ? activeSort.direction
                      : false
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
                    activeSort.column === "date" ? activeSort.direction : false
                  }
                />
              </Grid>
            </Grid>
          </Box>
        )}
        <Box sx={{ minWidth: { md: "700px", xs: "100%" } }}>
          {entries.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: index * 0.1 }} // Delay each entry animation
            >
              <TransactionEntry {...entry} isMobile={isMobile} />
            </motion.div>
          ))}
          {entries.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                px: 4,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.1))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)", opacity: 0.8 },
                    "50%": { transform: "scale(1.05)", opacity: 1 },
                  },
                }}
              >
                <Typography
                  sx={{ fontSize: "24px", color: "rgba(249, 115, 22, 0.8)" }}
                >
                  📊
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "18px",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {activeView === "personal"
                  ? "No Personal Transactions"
                  : "No Transactions Found"}
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "14px",
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
