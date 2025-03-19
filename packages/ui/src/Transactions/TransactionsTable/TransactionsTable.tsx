import React from "react";
import { Box, Grid, Tooltip, Typography, useMediaQuery } from "@mui/material"; // Import useMediaQuery
import { motion } from "framer-motion"; // Import Framer Motion
import FilterMenu from "./FilterMenu";
import { TransactionsTableProps } from "@phoenix-protocol/types";
import TransactionEntry from "./TransactionEntry";
import TransactionHeader from "./TransactionsHeader";
import { maxWidth } from "@mui/system";

const customSpacing = {
  xs: "8px",
  sm: "12px",
  md: "16px",
};

const classes = {
  root: {
    marginTop: customSpacing.md,
    padding: `${customSpacing.md} ${customSpacing.md}`,
    borderRadius: "12px", // Adjusted border radius
    background: "var(--neutral-900, #171717)", // Adjusted background
    overflowX: "auto",
    border: "1px solid var(--neutral-700, #404040)", // Adjusted border
  },
  tabUnselected: {
    display: "flex",
    width: "2.75rem",
    height: "2.3125rem",
    padding: `${customSpacing.md} ${customSpacing.sm}`,
    justifyContent: "center",
    alignItems: "center",
    gap: "0.625rem",
    borderRadius: "1rem",
    cursor: "pointer",
    color: "var(--neutral-300, #D4D4D4)", // Adjusted color
    background: "var(--neutral-900, #171717)", // Adjusted background
    opacity: 0.6,
    textAlign: "center",
    fontFeatureSettings: "'clig' off, 'liga' off",
    fontFamily: "Ubuntu",
    fontSize: "0.625rem",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "1.25rem", // 200%
    border: "1px solid var(--neutral-700, #404040)", // Adjusted border
  },
  tabSelected: {
    display: "flex",
    height: "2.25rem",
    padding: `${customSpacing.md} ${customSpacing.sm}`,
    justifyContent: "center",
    alignItems: "center",
    gap: "0.625rem",
    flex: "1 0 0",
    borderRadius: "1rem",
    border: "1px solid #F97316", // Adjusted color
    background: "rgba(249, 115, 22, 0.10)", // Adjusted background
    color: "var(--neutral-50, #FAFAFA)", // Adjusted color
    textAlign: "center",
    fontFeatureSettings: "'clig' off, 'liga' off",
    fontFamily: "Ubuntu",
    fontSize: "0.625rem",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "1.25rem", // 200%
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
            style={{
              padding: `${customSpacing.md} ${customSpacing.md}`,
              borderRadius: "8px",
              background: "var(--neutral-900, #171717)", // Adjusted background
              border: "1px solid var(--neutral-700, #404040)", // Adjusted border
              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
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
            <Box>
              <Typography
                style={{
                  color: "var(--neutral-300, #D4D4D4)", // Adjusted color
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "8px",
                }}
              >
                {activeView === "personal"
                  ? "It looks like you haven't made any transactions yet."
                  : "No transactions found."}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export { TransactionsTable };
