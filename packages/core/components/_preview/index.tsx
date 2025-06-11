import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { BaseNftCard } from "@phoenix-protocol/ui/src/Marketplace/Shared/BaseNftCard";

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
          <BaseNftCard
            id="preview1"
            image={"/nft/1.png"}
            collectionName={"Collection Name"}
            nftName={"Phoenix!"}
            price={"69.0k"}
            icon="/cryptoIcons/pho.svg"
            showVolume={false}
            size="medium"
            bottomContent={
              <Grid container>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: "11px", color: "#BDBEBE" }}>
                    Price
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      sx={{ width: "16px", mr: 0.5 }}
                      src="/cryptoIcons/pho.svg"
                    />
                    <Typography sx={{ fontSize: "14px", color: "#FFF" }}>
                      69.0k
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#BDBEBE",
                      textAlign: "right",
                    }}
                  >
                    Owned by
                  </Typography>
                  <Typography
                    sx={{ fontSize: "14px", color: "#FFF", textAlign: "right" }}
                  >
                    GCNP...WPHO
                  </Typography>
                </Grid>
              </Grid>
            }
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" } }}>
          <BaseNftCard
            id="preview2"
            image={"/nft/2.png"}
            collectionName={"Collection Name"}
            nftName={"On the Rise!"}
            price={"420.69k"}
            icon="/cryptoIcons/pho.svg"
            showVolume={false}
            size="medium"
            bottomContent={
              <Grid container>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: "11px", color: "#BDBEBE" }}>
                    Price
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      sx={{ width: "16px", mr: 0.5 }}
                      src="/cryptoIcons/pho.svg"
                    />
                    <Typography sx={{ fontSize: "14px", color: "#FFF" }}>
                      420.69k
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#BDBEBE",
                      textAlign: "right",
                    }}
                  >
                    Owned by
                  </Typography>
                  <Typography
                    sx={{ fontSize: "14px", color: "#FFF", textAlign: "right" }}
                  >
                    GCNP...WPHO
                  </Typography>
                </Grid>
              </Grid>
            }
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" } }}>
          <BaseNftCard
            id="preview3"
            image={"/nft/3.png"}
            collectionName={"Collection Name"}
            nftName={"We flyin' high!"}
            price={"13.37"}
            icon="/cryptoIcons/pho.svg"
            showVolume={false}
            size="medium"
            bottomContent={
              <Grid container>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: "11px", color: "#BDBEBE" }}>
                    Price
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      sx={{ width: "16px", mr: 0.5 }}
                      src="/cryptoIcons/pho.svg"
                    />
                    <Typography sx={{ fontSize: "14px", color: "#FFF" }}>
                      13.37
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#BDBEBE",
                      textAlign: "right",
                    }}
                  >
                    Owned by
                  </Typography>
                  <Typography
                    sx={{ fontSize: "14px", color: "#FFF", textAlign: "right" }}
                  >
                    GCNP...WPHO
                  </Typography>
                </Grid>
              </Grid>
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NftCarouselPlaceholder;
