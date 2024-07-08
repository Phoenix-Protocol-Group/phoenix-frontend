import React from "react";
import { Box, Grid, Typography } from "@mui/material";

export interface NftPreviewProps {
  image: string;
  collectionName: string;
  nftName: string;
  price: string;
  ownedBy: string;
}

const NftPreview = (props: NftPreviewProps) => {
  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
        border: "1px solid #2C2C31",
        borderRadius: "16px",
      }}
    >
      <Box position="relative">
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: "23px",
            mb: 3,
          }}
        >
          Preview
        </Typography>
        <Box
          component="img"
          sx={{
            maxWidth: "100%",
            border: "1px solid #2C2C31",
            borderRadius: "16px"
          }}
          alt="Preview Image"
          src={props.image}
        />
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            p: 2,
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) -1.56%, #000000 63.02%)",
            borderBottomRightRadius: "16px",
            borderBottomLeftRadius: "16px",
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              lineHeight: "16px",
              fontWeight: 500,
              color: "#BDBEBE",
            }}
          >
            {props.collectionName}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "16px",
              fontWeight: 700,
              color: "#FFF",
              mb: 2,
            }}
          >
            {props.nftName}
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: "11px",
                  lineHeight: "16px",
                  fontWeight: 500,
                  color: "#BDBEBE",
                }}
              >
                Price
              </Typography>
              <Box display="flex" alignItems="center">
                <Box
                  component="img"
                  sx={{
                    width: "16px",
                    mr: 0.5
                  }}
                  alt="pho icon"
                  src="/cryptoIcons/pho.svg"
                />
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: "24px",
                    color: "#FFF",
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
                  fontWeight: 500,
                  color: "#BDBEBE",
                  textAlign: "right",
                }}
              >
                Owned by
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "24px",
                  color: "#FFF",
                  textAlign: "right",
                }}
              >
                {props.ownedBy}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default NftPreview;
