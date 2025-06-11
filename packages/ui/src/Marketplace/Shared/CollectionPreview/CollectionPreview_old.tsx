import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { CollectionPreviewProps } from "@phoenix-protocol/types";
import { BaseNftCard } from "../BaseNftCard";

const CollectionPreview = (props: CollectionPreviewProps) => {
  // Custom bottom content for collection preview
  const bottomContent = (
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
          Floor Price
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
            {props.floorPrice}
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
          }}
        >
          Volume
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
            {props.volume}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
        border: "1px solid #2C2C31",
        borderRadius: "16px",
      }}
    >
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
      <BaseNftCard
        id={props.collectionName}
        image={props.image}
        collectionName="" // Collections don't show nested collection names
        nftName={props.collectionName}
        showVolume={false}
        bottomContent={bottomContent}
        size="medium"
      />
    </Box>
  );
};
                Volume
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
                  {props.volume}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CollectionPreview;
