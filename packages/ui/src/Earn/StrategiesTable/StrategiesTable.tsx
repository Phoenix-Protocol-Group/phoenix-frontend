import React, { useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { Button } from "../../Button/Button";
import TransactionHeader from "../../Transactions/TransactionsTable/TransactionsHeader";
import StrategyEntry, { StrategyEntryProps } from "./StrategyEntry";
import { FilterBar } from "../FilterBar/FilterBar";

type assetDisplay = {
  name: string;
  address: string;
  icon: string;
};

export interface StrategiesTableProps {
  title?: string;
  strategies: StrategyEntryProps[];
  showFilters?: boolean; // Prop to control filter visibility
}

const customSpacing = {
  xs: "8px",
  sm: "12px",
  md: "16px",
};

const tableClasses = {
  root: {
    marginTop: customSpacing.md,
    padding: `${customSpacing.md} ${customSpacing.md}`,
    borderRadius: "12px",
    background: "var(--neutral-900, #171717)",
    border: "1px solid var(--neutral-700, #404040)",
    overflowX: "auto",
  },
  header: {
    color: "var(--neutral-300, #D4D4D4)",
    fontFamily: "Ubuntu",
    fontSize: "0.75rem",
    fontWeight: 400,
    textTransform: "uppercase",
  },
  row: {
    borderBottom: "1px solid var(--neutral-700, #404040)",
    "&:last-child": {
      borderBottom: 0,
    },
  },
  cell: {
    color: "var(--neutral-50, #FAFAFA)",
    fontFamily: "Ubuntu",
    fontSize: "0.875rem",
    fontWeight: 400,
    padding: `${customSpacing.xs} ${customSpacing.md}`,
  },
  joinButton: {
    backgroundColor: "var(--primary-300, #F97316)",
    color: "var(--neutral-50, #FAFAFA)",
    "&:hover": {
      backgroundColor: "var(--primary-400, #F97316)",
    },
  },
};

const StrategiesTable = ({
  title,
  strategies,
  showFilters = true,
}: StrategiesTableProps) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [activeSort, setActiveSort] = React.useState({
    column: "",
    direction: false,
  });

  const [assetsFilter, setAssetsFilter] = useState<
    "Your assets" | "All Assets"
  >("Your assets");
  const [typeFilter, setTypeFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [instantUnbondOnly, setInstantUnbondOnly] = useState(false);

  const types = ["Type1", "Type2", "Type3"];
  const platforms = ["Platform1", "Platform2", "Platform3"];

  const handleSort = (column: string) => {
    setActiveSort((prev) => ({
      column: column,
      direction: prev.column === column ? !prev.direction : true,
    }));
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={tableClasses.root}>
        {/* Filter Bar */}
        {showFilters && (
          <Box sx={{ padding: customSpacing.md }}>
            <FilterBar
              assetsFilter={assetsFilter}
              onAssetsFilterChange={setAssetsFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              platformFilter={platformFilter}
              onPlatformFilterChange={setPlatformFilter}
              instantUnbondOnly={instantUnbondOnly}
              onInstantUnbondOnlyChange={setInstantUnbondOnly}
              types={types}
              platforms={platforms}
            />
          </Box>
        )}
        {/* Header */}
        {!isMobile && (
          <Box
            sx={{
              padding: `${customSpacing.md} ${customSpacing.md}`,
              borderRadius: "8px",
              background: "var(--neutral-900, #171717)",
              border: "1px solid var(--neutral-700, #404040)",
              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
              marginBottom: customSpacing.sm,
            }}
          >
            <Grid container>
              <Grid item xs={2}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="Asset(s)"
                  active={
                    activeSort.column === "asset"
                      ? activeSort.direction
                        ? "asc"
                        : "desc"
                      : false
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="Strategy Name"
                  active={
                    activeSort.column === "name"
                      ? activeSort.direction
                        ? "asc"
                        : "desc"
                      : false
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="TVL"
                  active={
                    activeSort.column === "tvl"
                      ? activeSort.direction
                        ? "asc"
                        : "desc"
                      : false
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="APR"
                  active={
                    activeSort.column === "apr"
                      ? activeSort.direction
                        ? "asc"
                        : "desc"
                      : false
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="Reward Token"
                  active={
                    activeSort.column === "rewardToken"
                      ? activeSort.direction
                        ? "asc"
                        : "desc"
                      : false
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TransactionHeader
                  handleSort={handleSort}
                  label="Unbond Time"
                  active={
                    activeSort.column === "unbondingTime"
                      ? activeSort.direction
                        ? "asc"
                        : "desc"
                      : false
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <Typography sx={tableClasses.header}></Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        {/* Table Body */}
        <Box sx={{ minWidth: 650, overflowX: "auto" }}>
          {strategies.map((strategy) => (
            <StrategyEntry
              key={strategy.name}
              {...strategy}
              isMobile={isMobile}
            />
          ))}
        </Box>
      </TableContainer>
    </Box>
  );
};

export { StrategiesTable };
