import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { CollectionsOverviewEntryProps } from "@phoenix-protocol/types";

const TopCollectionsEntry = (props: CollectionsOverviewEntryProps) => {
  const BoxStyle = {
    padding: "11px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #2C2C31",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
    "&:hover": {
      outline: "1px solid #E2621B",
    },
  };

  const EntryTextStyle = {
    color: "#FFF",
    fontSize: "14px",
    fontWeight: 500,
  };

  const rightAligned = {
    display: "flex",
    justifyContent: "flex-end",
    pr: 0.5
  }

  return (
    <Box sx={BoxStyle}>
      <Grid container alignItems="center">
        <Grid item xs={3} sx={{
          display: "flex",
          alignItems: "center"
        }}>
          <Typography sx={{ ...EntryTextStyle, opacity: 0.6, mr: 1.5 }}>
            {props._number+1}
          </Typography>
          <Box
            component="img"
            sx={{
              height: 38,
              width: 38,
              mr: 1.5
            }}
            alt={`${props.collectionName} preview image`}
            src={props.previewImage}
          />
          <Typography sx={{...EntryTextStyle, fontWeight: 700}}>{props.collectionName}</Typography>
        </Grid>
        <Grid item xs={2} sx={rightAligned}>
          <Typography sx={EntryTextStyle}>{props.floorPrice} PHO</Typography>
        </Grid>
        <Grid item xs={2} sx={rightAligned}>
          <Typography sx={EntryTextStyle}>{props.bestOffer} PHO</Typography>
        </Grid>
        <Grid item xs={2} sx={rightAligned}>
          <Typography sx={EntryTextStyle}>${props.volume} PHO</Typography>
        </Grid>
        <Grid item xs={2} sx={rightAligned}>
          <Typography sx={EntryTextStyle}>{props.owners}</Typography>
        </Grid>
        <Grid item xs={1} sx={rightAligned}>
          <Typography sx={EntryTextStyle}>{props.forSalePercent}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopCollectionsEntry;
