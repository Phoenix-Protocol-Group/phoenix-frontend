import { Box, Grid } from "@mui/material";
import Featured, { FeaturedProps } from "./Featured/Featured";
import TopCollections, { TopCollectionsProps } from "./TopCollections/TopCollections";
import PopularNfts, { PopularNftsProps } from "./PopularNfts/PopularNfts";
import RisingStars, { RisingStarsProps } from "./RisingStars/RisingStars";
import NftCategories, { NftCategoriesProps } from "./NftCategories/NftCategories";
import GettingStarted, { GettingStartedProps } from "./GettingStarted/GettingStarted";

export interface FeaturedCardProps {
  image: string;
  name: string;
  price: string;
  volume: string;
  icon: string;
}

export interface FrontpageProps {
  featuredProps: FeaturedProps;
  topCollectionsProps: TopCollectionsProps;
  popularNftsProps: PopularNftsProps;
  risingStarsProps: RisingStarsProps;
  nftCategoriesProps: NftCategoriesProps;
  gettingStartedProps: GettingStartedProps;
}

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
