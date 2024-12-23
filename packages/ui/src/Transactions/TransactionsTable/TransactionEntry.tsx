import React from "react";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { TransactionTableEntryProps } from "@phoenix-protocol/types";

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
        src={props.assets[0].icon}
        alt={props.assets[0].name}
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
        src={props.assets[1].icon}
        alt={props.assets[1].name}
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
        <Grid item xs={isMobile ? 3 : 2}>
          <Box
            sx={{
              borderRadius: "16px",
              border:
                props.type.toLowerCase() === "sell"
                  ? "2px solid #FF5722"
                  : "2px solid #4CAF50",
              background:
                props.type.toLowerCase() === "sell"
                  ? "rgba(255, 87, 34, 0.2)"
                  : "rgba(76, 175, 80, 0.2)",
              color:
                props.type.toLowerCase() === "sell" ? "#FF5722" : "#4CAF50",
              fontSize: isMobile ? "12px" : "14px",
              py: 0.5,
              px: 1.5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: isMobile ? "72px" : "96px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {props.type}
          </Box>
        </Grid>

        <Grid item xs={isMobile ? 5 : 4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {props.type.toLowerCase() == "sell" ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={props.assets[0].icon}
                    alt={props.assets[0].name}
                    sx={{ width: "20px", height: "20px", mr: "0.5rem" }}
                  />
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontSize: isMobile ? "14px" : "16px",
                      fontWeight: "500",
                    }}
                  >
                    {props.assets[0].name}
                  </Typography>
                </Box>
                <ArrowForward
                  sx={{
                    fontSize: isMobile ? "14px" : "16px",
                    color: "#FF5722",
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
                    src={props.assets[1].icon}
                    alt={props.assets[1].name}
                    sx={{ width: "20px", height: "20px", mr: "0.5rem" }}
                  />
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontSize: isMobile ? "14px" : "16px",
                      fontWeight: "500",
                    }}
                  >
                    {props.assets[1].name}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={props.assets[0].icon}
                    alt={props.assets[0].name}
                    sx={{ width: "20px", height: "20px", mr: "0.5rem" }}
                  />
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontSize: isMobile ? "14px" : "16px",
                      fontWeight: "500",
                    }}
                  >
                    {props.assets[0].name}
                  </Typography>
                </Box>
                <ArrowBack
                  sx={{
                    fontSize: isMobile ? "14px" : "16px",
                    color: "#4CAF50",
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
                    src={props.assets[1].icon}
                    alt={props.assets[1].name}
                    sx={{ width: "20px", height: "20px", mr: "0.5rem" }}
                  />
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontSize: isMobile ? "14px" : "16px",
                      fontWeight: "500",
                    }}
                  >
                    {props.assets[1].name}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Grid>

        <Grid item xs={isMobile ? 2 : 2}>
          <Typography
            sx={{
              color:
                props.type.toLowerCase() === "sell" ? "#FF5722" : "#4CAF50",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "600",
            }}
          >
            {props.tradeSize}
          </Typography>
        </Grid>

        <Grid item xs={isMobile ? 2 : 2}>
          <Typography
            sx={{
              color: "#B0E0E6",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "400",
            }}
          >
            ${props.tradeValue}
          </Typography>
        </Grid>

        <Grid item xs={isMobile ? 12 : 2}>
          <Typography
            sx={{
              color: "#FFF",
              fontSize: isMobile ? "12px" : "14px",
              opacity: "0.7",
            }}
          >
            {props.date}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionEntry;
