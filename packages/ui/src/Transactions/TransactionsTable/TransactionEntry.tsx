import React from "react";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { TransactionTableEntryProps } from "@phoenix-protocol/types";
import LaunchIcon from "@mui/icons-material/Launch";

const TransactionEntry = (props: TransactionTableEntryProps) => {
  const BoxStyle = {
    p: 3,
    borderRadius: "8px",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
    position: "relative",
    overflow: "hidden",
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box sx={{ ...BoxStyle, mt: 2 }}>
      <Box
        component="img"
        src={props.fromAsset.icon}
        alt={props.fromAsset.name}
        sx={{
          position: "absolute",
          top: "50%",
          left: isMobile ? -20 : -40,
          width: isMobile ? "12%" : "20%",
          height: "auto",
          opacity: 0.1,
          transform: "translateY(-50%)",
        }}
      />

      <Box
        component="img"
        src={props.toAsset.icon}
        alt={props.toAsset.name}
        sx={{
          position: "absolute",
          top: "50%",
          right: isMobile ? -20 : -40,
          width: isMobile ? "12%" : "20%",
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
        <Grid item xs={isMobile ? 5 : 2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "400",
                opacity: 0.6,
              }}
            >
              {new Date(props.date).toLocaleString()}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={isMobile ? 2 : 5}>
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
                sx={{ width: "20px", height: "20px", mr: "0.5rem" }}
              />
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "700",
                }}
              >
                {props.fromAmount}
              </Typography>
              <Typography
                sx={{
                  color: "#FFF",
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
                sx={{ width: "20px", height: "20px", mr: "0.5rem" }}
              />
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "700",
                }}
              >
                {props.toAmount}
              </Typography>
              <Typography
                sx={{
                  color: "#FFF",
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
        <Grid item xs={isMobile ? 2 : 2}>
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "400",
            }}
          >
            ${props.tradeValue}
          </Typography>
        </Grid>
        <Grid item xs={isMobile ? 2 : 3}>
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
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            <LaunchIcon
              sx={{ fontSize: isMobile ? "12px" : "14px", mr: 0.5 }}
            />
            {props.txHash}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionEntry;
