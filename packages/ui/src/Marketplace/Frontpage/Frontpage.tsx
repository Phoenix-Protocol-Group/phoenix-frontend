import React from "react";
import { Box, Grid } from "@mui/material";
import { motion } from "framer-motion";
import Featured from "./Featured/Featured";
import TopCollections from "./TopCollections/TopCollections";
import PopularNfts from "./PopularNfts/PopularNfts";
import RisingStars from "./RisingStars/RisingStars";
import NftCategories from "./NftCategories/NftCategories";
import GettingStarted from "./GettingStarted/GettingStarted";
import { FrontpageProps } from "@phoenix-protocol/types";

const Frontpage = (props: FrontpageProps) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Grid container spacing={{ xs: 3, md: 4, lg: 6 }}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Featured {...props.featuredProps} />
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TopCollections {...props.topCollectionsProps} />
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <PopularNfts {...props.popularNftsProps} />
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <RisingStars {...props.risingStarsProps} />
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <NftCategories {...props.nftCategoriesProps} />
          </motion.div>
        </Grid>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GettingStarted {...props.gettingStartedProps} />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Frontpage;
