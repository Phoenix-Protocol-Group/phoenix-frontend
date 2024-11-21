import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const NftPreview = (props: any) => {
  return (
    <Box sx={{ position: "relative", overflow: "hidden", borderRadius: "8px" }}>
      {/* Greyed-Out Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)", // Semi-transparent grey overlay
          zIndex: 1,
        }}
      />

      {/* Coming Soon Label */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "rgba(50, 50, 50, 0.8)", // Dark grey background
          color: "#FFF",
          px: 1.5,
          py: 0.5,
          borderRadius: "8px",
          zIndex: 2,
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        Coming Soon
      </Box>

      {/* NFT Image and Details */}
      <Box
        component="img"
        sx={{
          width: "100%",
          border: "1px solid #2C2C31",
          borderRadius: "16px",
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
          zIndex: 2,
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
                  mr: 0.5,
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
  );
};

const NftCarouselPlaceholder = () => {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        {/* Popular NFTs Title */}
        <Typography
          sx={{
            color: "var(--Secondary-S2, #FFF)",
            fontFamily: "Ubuntu",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            mr: 2, // Margin to separate title from label
          }}
        >
          Popular NFTs
        </Typography>

        {/* Feature Preview Label */}
        <Box
          sx={{
            background: "#5B5B5B",
            color: "#FFF",
            px: 1.5,
            py: 0.5,
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          FEATURE PREVIEW
        </Box>
      </Box>
      <Grid container spacing={3}>
        {/* Responsive Grid for NFT Previews */}
        <Grid item xs={12} md={4}>
          <NftPreview
            image={"/nft/1.png"}
            collectionName={"Collection Name"}
            nftName={"Phoenix!"}
            ownedBy={"GCNP...WPHO"}
            price={"69.0k"}
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" } }}>
          <NftPreview
            image={"/nft/2.png"}
            collectionName={"Collection Name"}
            nftName={"On the Rise!"}
            ownedBy={"GCNP...WPHO"}
            price={"420.69k"}
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" } }}>
          <NftPreview
            image={"/nft/3.png"}
            collectionName={"Collection Name"}
            nftName={"We flyin' high!"}
            ownedBy={"GCNP...WPHO"}
            price={"13.37"}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NftCarouselPlaceholder;
