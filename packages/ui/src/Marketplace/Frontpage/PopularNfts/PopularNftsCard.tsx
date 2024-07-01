import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { PopularNftCardProps } from "./PopularNfts";

const PopularNftsCard = (props: PopularNftCardProps) => {
  return (
    <Box
      onClick={() => props._onClick(props.id)}
      sx={{
        border: "1px solid #2C2C31",
        backgroundColor: "#1F2123",
        cursor: "pointer",
        borderRadius: "12px",
        overflowY: "hidden",
        "&:hover": {
          borderColor: "#E2621B",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          sx={{
            maxWidth: "100%",
          }}
          alt="nft preview image"
          src={props.image}
        />
      </Box>
      <Grid
        container
        sx={{
          p: 2,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)",
        }}
      >
        <Grid item xs={12} mb={1}>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 500,
              lineHeight: "16px",
              mb: 0.5,
              color: "#BDBEBE",
            }}
          >
            {props.collectionName}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              lineHeight: "16px",
              marginBottom: "8px",
            }}
          >
            {props.nftName}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            sx={{
              fontSize: "11px",
              lineHeight: "16px",
              color: "#BDBEBE",
            }}
          >
            Floor Price
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              sx={{
                maxWidth: "16px",
                marginRight: "4px",
              }}
              alt="asset icon"
              src={props.icon}
            />
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "24px",
                fontWeight: 400,
              }}
            >
              {props.price}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography
            sx={{
              fontSize: "11px",
              lineHeight: "16px",
              color: "#BDBEBE",
            }}
          >
            Volume
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              sx={{
                maxWidth: "16px",
                marginRight: "4px",
              }}
              alt="asset icon"
              src={props.icon}
            />
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "24px",
                fontWeight: 400,
              }}
            >
              {props.volume}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PopularNftsCard;
