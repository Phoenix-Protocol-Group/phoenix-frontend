import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { TransactionsCardsProps } from "@phoenix-protocol/types";

const TransactionCard = ({
  title,
  content,
  icon,
}: {
  title: string;
  content: string;
  icon?: string;
}) => (
  <Grid
    item
    xs={4}
    sx={{
      px: 3,
      py: 4,
      borderRadius: "12px",
      flex: 1,
      background: "var(--neutral-900, #171717)",
      border: "1px solid var(--neutral-700, #404040)",
    }}
  >
    <Typography
      sx={{
        fontSize: "12px",
        color: "var(--neutral-300, #D4D4D4)",
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontSize: "32px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        color: "var(--neutral-50, #FAFAFA)",
      }}
    >
      {icon && (
        <Box
          component="img"
          src={icon}
          sx={{ pr: 1, width: "32px", height: "32px" }}
        />
      )}
      {content}
    </Typography>
  </Grid>
);

const TransactionsCards = (props: TransactionsCardsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        gap: { lg: "1.5rem", xs: "1rem" },
        mt: "1.5rem",
        flexDirection: { lg: "row", xs: "column" },
      }}
    >
      <TransactionCard title="Total Trades" content={props.totalTrades} />
      <TransactionCard title="Total Users" content={props.totalTraders} />
      {props.mostTradedAsset && (
        <TransactionCard
          title="Most Traded Asset"
          content={props.mostTradedAsset.name}
          icon={props.mostTradedAsset.icon}
        />
      )}
    </Box>
  );
};

export { TransactionsCards };
