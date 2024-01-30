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
  // Set State for search
  const [searchValue, setSearchValue] = React.useState("");
  // Set state for tabs
  const [selectedTab, setSelectedTab] = React.useState("all");

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
              selectedTab === "all"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => setSelectedTab("all")}
          >
            All
          </Box>
          <Box
            sx={
              selectedTab === "personal"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => setSelectedTab("personal")}
          >
            Personal
          </Box>
        </Box>
        <Input
          placeholder="Search"
          onChange={(e: any) => setSearchValue(e.target.value)}
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
        <FilterMenu />
      </Box>
      <Box sx={{ ...BoxStyle, mb: 2 }}>
        <Grid container>
          <Grid item xs={2}>
            <TransactionHeader label="Trade type" active={false} />
          </Grid>
          <Grid item xs={3}>
            <TransactionHeader label="Asset" active={false} />
          </Grid>
          <Grid item xs={2}>
            <TransactionHeader label="Trade Size" active={true} />
          </Grid>
          <Grid item xs={2}>
            <TransactionHeader label="Trade Value" active={false} />
          </Grid>
          <Grid item xs={2}>
            <TransactionHeader label="Date" active={false} />
          </Grid>
          <Grid item xs={1}>
            <TransactionHeader label="Actions" active={false} />
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
          />
        ))}
      </Box>
    </Box>
  );
};

export { TransactionsTable };
