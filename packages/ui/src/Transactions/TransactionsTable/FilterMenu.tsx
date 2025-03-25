import React from "react";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import LaunchIcon from "@mui/icons-material/Launch";
import { TransactionTableEntryProps } from "@phoenix-protocol/types";

const TransactionEntry = (
  props: TransactionTableEntryProps & { isMobile: boolean }
) => {
  const { isMobile } = props; // Destructure isMobile
  const BoxStyle = {
    p: 3,
    borderRadius: "12px", // Adjusted border radius
    background: "var(--neutral-900, #171717)", // Adjusted background
    border: "1px solid var(--neutral-700, #404040)", // Adjusted border
    position: "relative",
    overflow: "hidden",
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  };

  return (
    <Box sx={{ ...BoxStyle, mt: 2 }}>
      <Box
        component="img"
        src={props.fromAsset.icon}
        alt={props.fromAsset.name}
        sx={{
          position: "absolute",
          top: "50%",

          width: "20%",
          height: "auto",
          opacity: 0.1,
          transform: "translateY(-50%)",
          ...(isMobile ? { right: 80 } : { left: -40 }),
        }}
      />

      <Box
        component="img"
        src={props.toAsset.icon}
        alt={props.toAsset.name}
        sx={{
          position: "absolute",
          top: "50%",
          right: isMobile ? 0 : -40,
          width: "20%",
          height: "auto",
          opacity: 0.1,
          transform: "translateY(-50%)",
        }}
      />

      <Grid
        container
        alignItems="center"
        spacing={isMobile ? 1 : 3}
        sx={{ position: "relative", zIndex: 2 }}
      >
        <Grid item xs={12} md={2}>
          {isMobile && (
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "var(--neutral-400, #A3A3A3)", // Adjusted color
                opacity: 0.6,
              }}
            >
              Date
            </Typography>
          )}
          <Typography
            sx={{
              color: "var(--neutral-300, #D4D4D4)", // Adjusted color
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "400",
              opacity: 0.6,
            }}
          >
            {new Date(props.date).toLocaleString()}
          </Typography>
        </Grid>

        <Grid item xs={12} md={5}>
          {isMobile && (
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "var(--neutral-400, #A3A3A3)", // Adjusted color
                opacity: 0.6,
              }}
            >
              Swap Details
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={props.fromAsset.icon}
                alt={props.fromAsset.name}
                sx={{
                  width: "20px",
                  height: "20px",
                  mr: "0.5rem",
                  opacity: 0.7,
                }} // Adjusted opacity
              />
              <Typography
                sx={{
                  color: "var(--neutral-50, #FAFAFA)", // Adjusted color
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "500", // Adjusted font weight
                }}
              >
                {props.fromAmount}
              </Typography>
              <Typography
                sx={{
                  color: "var(--neutral-300, #D4D4D4)", // Adjusted color
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "400",
                  opacity: 0.6,
                  ml: 1,
                }}
              >
                {props.fromAsset.name}
              </Typography>
            </Box>
            <ArrowForward
              sx={{
                fontSize: isMobile ? "14px" : "16px",
                mx: 1,
                color: "var(--neutral-300, #D4D4D4)", // Adjusted color
                opacity: 0.7, // Adjusted opacity
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={props.toAsset.icon}
                alt={props.toAsset.name}
                sx={{
                  width: "20px",
                  height: "20px",
                  mr: "0.5rem",
                  opacity: 0.7,
                }} // Adjusted opacity
              />
              <Typography
                sx={{
                  color: "var(--neutral-50, #FAFAFA)", // Adjusted color
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "500", // Adjusted font weight
                }}
              >
                {props.toAmount}
              </Typography>
              <Typography
                sx={{
                  color: "var(--neutral-300, #D4D4D4)", // Adjusted color
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "400",
                  opacity: 0.6,
                  ml: 1,
                }}
              >
                {props.toAsset.name}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          {isMobile && (
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "var(--neutral-400, #A3A3A3)", // Adjusted color
                opacity: 0.6,
              }}
            >
              Trade Value (USD)
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "400",
              color: "var(--neutral-300, #D4D4D4)", // Adjusted color
            }}
          >
            ${props.tradeValue}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          {isMobile && (
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                color: "var(--neutral-400, #A3A3A3)", // Adjusted color
                opacity: 0.6,
              }}
            >
              Transaction ID
            </Typography>
          )}
          <Typography
            onClick={() =>
              window.open(
                `https://stellar.expert/explorer/public/tx/${props.txHash}`,
                "_blank"
              )
            }
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "400",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              color: "var(--neutral-300, #D4D4D4)", // Adjusted color
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            <LaunchIcon // Changed to OpenInNewIcon
              sx={{
                fontSize: isMobile ? "12px" : "14px",
                mr: 0.5,
                color: "var(--neutral-300, #D4D4D4)",
              }} // Adjusted color
            />
            {props.txHash}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionEntry;
