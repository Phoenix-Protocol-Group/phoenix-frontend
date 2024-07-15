import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { FavoriteBorder, Image, IosShare } from "@mui/icons-material";

import { Button as PhoenixButton } from "../../Button/Button";
import { Divider, NftListing } from "../Shared";
import { CollectionSingleProps } from "@phoenix-protocol/types";

const imagePreviewStyle = {
  width: "80px",
  height: "80px",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
  border: "1px solid #2C2C31",
  borderRadius: "16px",
};

const outlinedIconButtonStyle = {
  border: "1px solid #2C2C31",
  background: "transparent !important",
  color: "white",
  padding: "8px 16px !important",
  borderRadius: "8px",
  fontSize: "14px",
  lineHeight: "20px",
  display: "flex",
  gap: 1,
  fontWeight: 500,
};

const CollectionInfoItem = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => (
  <Box sx={{
    width: {
      xs: "25%",
      sm: "unset"
    }
  }}>
    <Typography
      sx={{
        fontSize: "10px",
        lineHeight: "20px",
        fontWeight: 700,
        color: "rgba(255, 255, 255, 0.6)",
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: 500,
        color: "white",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const CollectionSingle = (props: CollectionSingleProps) => {
  return (
    <Box>
      <Grid
        container
        rowSpacing={3}
        p={{
          xs: 0,
          sm: 3,
        }}
      >
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs="auto">
              {!props.previewImage ? (
                <Box
                  sx={{
                    ...imagePreviewStyle,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image sx={{ fontSize: "18px" }} />
                </Box>
              ) : (
                <Box
                  component="img"
                  sx={imagePreviewStyle}
                  alt="Collection Preview Image"
                  src={props.previewImage}
                />
              )}
            </Grid>
            <Grid item xs>
              <Typography
                sx={{
                  fontSize: "20px",
                  lineHeight: "23px",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {props.name}
              </Typography>
              <Box display="flex" mb={1}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#C3C3C3",
                    mr: 0.5,
                  }}
                >
                  Created by
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "white",
                    fontWeight: 500,
                  }}
                >
                  {`${props.creator.substring(
                    0,
                    4
                  )}...${props.creator.substring(props.creator.length - 4)}`}
                </Typography>
              </Box>
              <Box display="flex" mb={1}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#C3C3C3",
                  }}
                >
                  {props.description.substring(0, 60)}...
                </Typography>
                <Button
                  sx={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "white",
                    fontWeight: 500,
                    textTransform: "none",
                    p: 0,
                    background: "none !important",
                  }}
                >
                  More
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "flex-start",
            justifyContent: {
              xs: "flex-start",
              sm: "flex-end",
            },
          }}
        >
          <Button sx={outlinedIconButtonStyle}>
            <FavoriteBorder sx={{ fontSize: "14px" }} />
            {props.likes}
          </Button>
          <Button
            sx={{
              ...outlinedIconButtonStyle,
              minWidth: "38px",
              maxWidth: "40px",
              height: "38px",
              padding: 0,
            }}
          >
            <IosShare sx={{ fontSize: "14px", color: "white" }} />
          </Button>
          <PhoenixButton
            label="Make Collection Offer"
            sx={{
              fontSize: "14px",
              lineHeight: "16px",
              fontWeight: 700,
              borderRadius: "12px",
              padding: "11px 12px",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: {xs: "flex-start", sm: "flex-end"},
            gap: 3,
            flexWrap: "wrap",
            mb: {
              xs: 2,
              sm: 0
            }
          }}
        >
          <CollectionInfoItem
            title="Floor Price"
            value={`${props.floorPrice} PHO`}
          />
          <CollectionInfoItem
            title="Best Offer"
            value={`${props.bestOffer} PHO`}
          />
          <CollectionInfoItem
            title="7D Volume"
            value={`${props.volume7d} PHO`}
          />
          <CollectionInfoItem title="Owners" value={props.owners} />
          <CollectionInfoItem title="For Sale" value={props.forSale} />
          <CollectionInfoItem title="Total" value={props.total} />
          <CollectionInfoItem title="Royalities" value={props.royalities} />
        </Grid>
      </Grid>
      <Box pb={3}>
        <Divider />
      </Box>
      <NftListing {...props} />
    </Box>
  );
};

export default CollectionSingle;
