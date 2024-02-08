import {
  ArrowDownward,
  ArrowRightAlt,
  ExpandMore,
  ManageSearch,
  SwapVert,
  Tune,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Input,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import FilterMenu from "./FilterMenu";
import {
  TransactionsTableProps,
  TransactionTableEntryProps,
} from "@phoenix-protocol/types";
import React from "react";
import TransactionEntry from "./TransactionEntry";
import TransactionHeader from "./TransactionsHeader";

const BoxStyle = {
  p: 2,
  borderRadius: "8px",
  border: "1px solid #2C2C31",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
};


const TransactionsTable = (props: TransactionsTableProps) => {
  const tabUnselectedStyles = {
    display: "flex",
    width: "2.75rem",
    height: "2.3125rem",
    padding: "1.125rem 1.5rem",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.625rem",
    borderRadius: "1rem",
    cursor: "pointer",
    background:
      "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
    color: "#FFF",
    opacity: 0.6,
    textAlign: "center",
    fontFeatureSettings: "'clig' off, 'liga' off",
    fontFamily: "Ubuntu",
    fontSize: "0.625rem",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "1.25rem", // 200%
  };

  const tabSelectedStyles = {
    display: "flex",
    height: "2.25rem",
    padding: "1.125rem 1.5rem",
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
  };

  return (
    <Box
      sx={{
        mt: 2,
        p: 3,
        borderRadius: 3,
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
      }}
    >
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
          <Box
            sx={
              props.activeView === "all"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveView("all")}
          >
            All
          </Box>
          <Box
            sx={
              props.activeView === "personal"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveView("personal")}
          >
            Personal
          </Box>
        </Box>
        <Input
          placeholder="Search"
          onChange={(e: any) => props.setSearchTerm(e.target.value)}
          sx={{
            flex: 1,
            borderRadius: "8px",
            border: "1px solid #2C2C31",
            background: "#2C2C31",
            padding: "4px 16px",
            lineHeight: "18px",
            fontSize: "13px",
            ml: "0.75rem",
            "&:before": {
              content: "none",
            },
            "&:after": {
              content: "none",
            },
          }}
          startAdornment={
            <img style={{ marginRight: "8px" }} src="/MagnifyingGlass.svg" />
          }
        />
        <FilterMenu
          activeFilters={props.activeFilters}
          applyFilters={props.applyFilters}
        />
      </Box>
      <Box sx={{ ...BoxStyle, mb: 2 }}>
        <Grid container>
          <Grid item xs={2}>
            <TransactionHeader
              handleSort={props.handleSort}
              label="Trade type"
              active={
                props.activeSort.column === "tradeType"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
          <Grid item xs={3}>
            <TransactionHeader
              handleSort={props.handleSort}
              label="Asset"
              active={
                props.activeSort.column === "asset"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TransactionHeader
              handleSort={props.handleSort}
              label="Trade Size"
              active={
                props.activeSort.column === "tradeSize"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TransactionHeader
              handleSort={props.handleSort}
              label="Trade Value"
              active={
                props.activeSort.column === "tradeValue"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TransactionHeader
              handleSort={props.handleSort}
              label="Date"
              active={
                props.activeSort.column === "date"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
          <Grid item xs={1}>
            <TransactionHeader
              handleSort={props.handleSort}
              label="Actions"
              active={
                props.activeSort.column === "actions"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        {props.entries.map((entry, index) => (
          <TransactionEntry
            type={entry.type}
            assets={entry.assets}
            tradeSize={entry.tradeSize}
            tradeValue={entry.tradeValue}
            date={entry.date}
            txHash={entry.txHash}
          />
        ))}
      </Box>
    </Box>
  );
};

export { TransactionsTable };
