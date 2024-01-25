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
      border: "1px solid #2C2C31",
      background:
        "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
    }}
  >
    <Typography
      sx={{
        fontSize: "12px",
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
      }}
    >
      {icon && <Box component="img" src={icon} sx={{ pr: 1 }} />}
      {content}
    </Typography>
  </Grid>
);

const TransactionsCards = (props: TransactionsCardsProps) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <TransactionCard title="Active Traders" content={props.activeTraders} />
        <TransactionCard title="Total Traders" content={props.totalTraders} />
        <TransactionCard
          title="Most Traded Asset"
          content={props.mostTradedAsset.name}
          icon={props.mostTradedAsset.icon}
        />
      </Grid>
    </Box>
  );
};

export { TransactionsCards };
