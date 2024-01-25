import { ArrowDownward, ArrowRightAlt, ExpandMore, ManageSearch, SwapVert, Tune } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  Typography,
} from "@mui/material";
import {
  TransactionsTableProps,
  TransactionTableEntryProps,
} from "@phoenix-protocol/types";
import React from "react";

const BoxStyle = {
  p: 2,
  borderRadius: "8px",
  border: "1px solid #2C2C31",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
};

const TransactionsEntry = (props: TransactionTableEntryProps) => {
  return (
    <Box sx={{ ...BoxStyle, mb: 2 }}>
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Box
            sx={{
              borderRadius: "16px",
              border:
                props.type === "Sent" ? "1px solid #F22" : "1px solid #5BFF22",
              background:
                props.type === "Sent"
                  ? "rgba(255, 34, 34, 0.20)"
                  : "rgba(91, 255, 34, 0.20)",
              color: props.type === "Sent" ? "#F22" : "#5BFF22",
              fontSize: "12px",
              py: 0.5,
              display: "inline-flex",
              width: "88px",
              justifyContent: "center",
            }}
          >
            {props.type}
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            {props.assets.map((asset, index) => (
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {asset.name} {index !== props.assets.length - 1 && <ArrowRightAlt sx={{fontSize: "24px"}} />}
              </Typography>
            ))}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "14px",
            }}
          >
            {props.tradeSize}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "14px",
              opacity: "0.6",
            }}
          >
            ${props.tradeValue}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: "14px",
              opacity: "0.6",
            }}
          >
            {props.date}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton>
            <ManageSearch sx={{fontSize: "20px"}}/>
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

const TableHeader = ({ label, active }: { label: string; active: boolean }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
    }}
  >
    <Typography
      sx={{
        fontSize: "10px",
        lineHeight: "200%",
        fontWeight: "700",
        textTransform: "uppercase",
        opacity: active ? "1" : "0.6",
        mr: 0.5,
      }}
    >
      {label}
    </Typography>
    {active ? (
      <ArrowDownward sx={{ fontSize: "14px" }} />
    ) : (
      <SwapVert sx={{ fontSize: "14px", opacity: "0.6" }} />
    )}
  </Box>
);

const TransactionsTable = (props: TransactionsTableProps) => {
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
      }}
    >
      <Box sx={{ display: "flex", mb: 2 }}>
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
        <Button
          sx={{
            ...BoxStyle,
            textTransform: "none",
            fontSize: "13px",
            color: "rgba(255, 255, 255, 0.6)",
            borderRadius: "8px",
            lineHeight: "20px",
            ml: 3,
            height: "38px",
          }}
        >
          <Tune sx={{fontSize: "15px", mr: 0.5}} />
          Filter
          <ExpandMore sx={{fontSize: "14px", ml: 0.5}} />
        </Button>
      </Box>
      <Box sx={{ ...BoxStyle, mb: 2 }}>
        <Grid container>
          <Grid item xs={2}>
            <TableHeader label="Trade type" active={false} />
          </Grid>
          <Grid item xs={3}>
            <TableHeader label="Asset" active={false} />
          </Grid>
          <Grid item xs={2}>
            <TableHeader label="Trade Size" active={true} />
          </Grid>
          <Grid item xs={2}>
            <TableHeader label="Trade Value" active={false} />
          </Grid>
          <Grid item xs={2}>
            <TableHeader label="Date" active={false} />
          </Grid>
          <Grid item xs={1}>
            <TableHeader label="Actions" active={false} />
          </Grid>
        </Grid>
      </Box>
      <Box>
        {props.entries.map((entry, index) => (
          <TransactionsEntry
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
