import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { CreateOptionCard } from "../Shared";

export interface CreateSomethingProps {
  onCreateCollectionClick: () => void;
  onCreateNftClick: () => void;
}

const CreateSomething = (props: CreateSomethingProps) => {
  return (
    <Box>
      <Grid
        container
        rowSpacing={5}
        sx={{
          maxWidth: "680px",
          margin: "0 auto",
        }}
      >
        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: "48px",
              fontWeight: 700,
              lineHeight: "56px",
              textAlign: "center",
              mb: 1.5,
            }}
          >
            Create something!
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              lineHeight: "25.2px",
              textAlign: "center",
              color: "#BFBFBF",
            }}
          >
            Please select what would you like to create today
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <CreateOptionCard
                title="Drop a Collection"
                description="Launch your NFT collection for others to purchase. Your items won't display until they've been minted."
                onClick={props.onCreateCollectionClick}
              />
            </Grid>
            <Grid item xs={12}>
              <CreateOptionCard
                title="Mint an NFT"
                description="Create a public collection and immediately mint NFTs directly to your wallet to own or list for sale."
                onClick={props.onCreateNftClick}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateSomething;
