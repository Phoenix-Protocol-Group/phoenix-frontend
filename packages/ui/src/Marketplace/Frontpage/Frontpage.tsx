import React from "react";
import { Box, Grid } from "@mui/material";
import Featured from "./Featured/Featured";
import TopCollections from "./TopCollections/TopCollections";
import PopularNfts from "./PopularNfts/PopularNfts";
import RisingStars from "./RisingStars/RisingStars";
import NftCategories from "./NftCategories/NftCategories";
import GettingStarted from "./GettingStarted/GettingStarted";
import { FrontpageProps } from "@phoenix-protocol/types";

const Frontpage = (props: FrontpageProps) => {
  return (
    <Box>
      <Grid container rowSpacing={6}>
        <Grid item xs={12}>
          <Featured {...props.featuredProps} />
        </Grid>
        <Grid item xs={12}>
          <TopCollections {...props.topCollectionsProps} />
        </Grid>
        <Grid item xs={12}>
          <PopularNfts {...props.popularNftsProps} />
        </Grid>
        <Grid item xs={12}>
          <RisingStars {...props.risingStarsProps} />
        </Grid>
        <Grid item xs={12}>
          <NftCategories {...props.nftCategoriesProps} />
        </Grid>
        <Grid item xs={12}>
          <GettingStarted {...props.gettingStartedProps} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Frontpage;
