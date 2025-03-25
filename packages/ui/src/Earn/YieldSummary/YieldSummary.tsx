import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { formatCurrencyStatic } from "@phoenix-protocol/utils";
import { Button } from "../../Button/Button";

export interface YieldSummaryProps {
  totalValue: number;
  claimableRewards: number;
  onClaimAll: () => void;
}

const YieldSummary = ({
  totalValue,
  claimableRewards,
  onClaimAll,
}: YieldSummaryProps) => {
  return (
    <Grid container sx={{ minHeight: "200px" }} spacing={2}>
      <Grid item xs={12} md={8}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            height: "100%",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid var(--neutral-700, #404040)",
            background: "var(--neutral-900, #171717)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            position: "relative",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <Box
            component="img"
            src={"/saving.png"}
            alt={"Title"}
            sx={{
              position: "absolute",
              top: "50%",
              width: "400px",
              height: "auto",
              opacity: 0.8,
              transform: "translateY(-50%)",
              right: -40,
            }}
          />
          <Typography
            sx={{
              fontSize: "12px",
              lineHeight: "200%",
              fontWeight: "700",
              textTransform: "uppercase",
              color: "var(--neutral-300, #D4D4D4)", // Adjusted color
              opacity: 0.6,
              mr: 0.5,
            }}
          >
            Total Value of Positions
          </Typography>
          <Typography
            sx={{
              color: "var(--neutral-50, #FAFAFA)",
              fontFamily: "Ubuntu",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            {formatCurrencyStatic.format(totalValue)}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box
          sx={{
            display: "inline-block",
            background: "linear-gradient(180deg, #E2391B 0%, #E29E1B 100%)",
            padding: "1px",
            borderRadius: "12px",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid var(--neutral-700, #404040)",
              background: "var(--neutral-900, #171717)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
              position: "relative",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  lineHeight: "200%",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  color: "var(--neutral-300, #D4D4D4)", // Adjusted color
                  opacity: 0.6,
                  mr: 0.5,
                }}
              >
                Claimable Rewards
              </Typography>
              <Typography
                sx={{
                  color: "var(--success-300)",
                  fontFamily: "Ubuntu",
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                {formatCurrencyStatic.format(claimableRewards)}
              </Typography>
            </Box>
            <Button type="primary" onClick={onClaimAll}>
              Claim All
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export { YieldSummary };
