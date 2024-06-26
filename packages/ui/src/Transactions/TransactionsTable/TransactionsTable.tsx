import React from "react";
import { Box, Grid, Tooltip, Typography } from "@mui/material";
import { motion } from "framer-motion"; // Import Framer Motion
import FilterMenu from "./FilterMenu";
import { TransactionsTableProps } from "@phoenix-protocol/types";
import TransactionEntry from "./TransactionEntry";
import TransactionHeader from "./TransactionsHeader";

const customSpacing = {
  xs: "8px",
  sm: "12px",
  md: "16px",
};

const classes = {
  root: {
    marginTop: customSpacing.md,
    padding: `${customSpacing.md} ${customSpacing.md}`,
    borderRadius: "8px",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
    overflowX: "auto",
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
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
    color: "#FFF",
    opacity: 0.6,
    textAlign: "center",
    fontFeatureSettings: "'clig' off, 'liga' off",
    fontFamily: "Ubuntu",
    fontSize: "0.625rem",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "1.25rem", // 200%
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
    border: "1px solid var(--Primary-P3, #E2571C)",
    background: "rgba(226, 73, 26, 0.10)",
    color: "#FFF",
    textAlign: "center",
    fontFeatureSettings: "'clig' off, 'liga' off",
    fontFamily: "Ubuntu",
    fontSize: "0.625rem",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "1.25rem", // 200%
  },
};

const TransactionsTable: React.FC<TransactionsTableProps> = ({
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
          style={{
            display: "flex",
            marginBottom: customSpacing.md,
            minWidth: "700px",
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
        <Box
          style={{
            padding: `${customSpacing.md} ${customSpacing.md}`,
            borderRadius: "8px",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          }}
        >
          <Grid container>
            <Grid item xs={2}>
              <TransactionHeader
                handleSort={handleSort}
                label="Trade type"
                active={
                  activeSort.column === "tradeType"
                    ? activeSort.direction
                    : false
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TransactionHeader
                handleSort={handleSort}
                label="Asset"
                active={
                  activeSort.column === "asset" ? activeSort.direction : false
                }
              />
            </Grid>
            <Grid item xs={2}>
              <TransactionHeader
                handleSort={handleSort}
                label="Trade Size"
                active={
                  activeSort.column === "tradeSize"
                    ? activeSort.direction
                    : false
                }
              />
            </Grid>
            <Grid item xs={2}>
              <TransactionHeader
                handleSort={handleSort}
                label="Trade Value"
                active={
                  activeSort.column === "tradeValue"
                    ? activeSort.direction
                    : false
                }
              />
            </Grid>
            <Grid item xs={2}>
              <TransactionHeader
                handleSort={handleSort}
                label="Date"
                active={
                  activeSort.column === "date" ? activeSort.direction : false
                }
              />
            </Grid>
            <Grid item xs={1}>
              <TransactionHeader
                handleSort={handleSort}
                label="Explore"
                active={
                  activeSort.column === "actions" ? activeSort.direction : false
                }
              />
            </Grid>
          </Grid>
        </Box>
        <Box style={{ minWidth: "700px" }}>
          {entries.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: index * 0.1 }} // Delay each entry animation
            >
              <TransactionEntry
                type={entry.type}
                assets={entry.assets}
                tradeSize={entry.tradeSize}
                tradeValue={entry.tradeValue}
                date={entry.date}
                txHash={entry.txHash}
              />
            </motion.div>
          ))}
          {entries.length === 0 && (
            <Box>
              <Typography
                style={{
                  color: "#FFF",
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
