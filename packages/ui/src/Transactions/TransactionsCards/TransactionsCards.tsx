import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
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
      borderRadius: "16px",
      flex: 1,
      background: `
        linear-gradient(135deg, rgba(23, 23, 23, 0.8) 0%, rgba(38, 38, 38, 0.6) 100%),
        radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 70%)
      `,
      border: "1px solid rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow:
          "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(249, 115, 22, 0.2)",
        border: "1px solid rgba(249, 115, 22, 0.3)",
        background: `
          linear-gradient(135deg, rgba(23, 23, 23, 0.9) 0%, rgba(38, 38, 38, 0.7) 100%),
          radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 70%)
        `,
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)",
        opacity: 0,
        transition: "opacity 0.3s ease",
      },
      "&:hover::before": {
        opacity: 1,
      },
    }}
  >
    <Typography
      sx={{
        fontSize: "12px",
        color: "rgba(255, 255, 255, 0.6)",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        mb: 1,
        position: "relative",
        zIndex: 2,
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
        color: "#FAFAFA",
        position: "relative",
        zIndex: 2,
        background: icon
          ? "linear-gradient(135deg, #ffffff 0%, #e4e4e7 100%)"
          : "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: icon ? "transparent" : "transparent",
      }}
    >
      {icon && (
        <Box
          component="img"
          src={icon}
          sx={{
            pr: 1,
            width: "32px",
            height: "32px",
            filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.3))",
          }}
        />
      )}
      {content}
    </Typography>
  </Grid>
);

const TransactionsCards = (props: TransactionsCardsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          gap: { lg: "1.5rem", xs: "1rem" },
          mt: "2rem",
          mb: "2rem",
          flexDirection: { lg: "row", xs: "column" },
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ flex: 1 }}
        >
          <TransactionCard title="Total Trades" content={props.totalTrades} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ flex: 1 }}
        >
          <TransactionCard title="Total Users" content={props.totalTraders} />
        </motion.div>

        {props.mostTradedAsset && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ flex: 1 }}
          >
            <TransactionCard
              title="Most Traded Asset"
              content={props.mostTradedAsset.name}
              icon={props.mostTradedAsset.icon}
            />
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export { TransactionsCards };
