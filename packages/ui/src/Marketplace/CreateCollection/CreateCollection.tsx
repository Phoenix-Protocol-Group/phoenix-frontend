import { Box, Grid, Typography } from "@mui/material";
import {
  BackButton,
  ImageUpload,
  CollectionPreview,
  TextArea,
  TextInput,
  TextSelect,
  Divider,
} from "../Shared";
import React from "react";
import { Button } from "../../Button/Button";
import { CreateCollectionProps } from "@phoenix-protocol/types";

const h2Style = {
  fontSize: "32px",
  fontWeight: 700,
  lineHeight: "37px",
};

const h2Subtext = {
  mt: 1,
  fontSize: "14px",
  lineHeight: "24px",
  color: "#BDBEBE",
};

const h3Style = {
  fontSize: "18px",
  lineHeight: "21px",
  fontWeight: 700,
};

const CreateCollection = (props: CreateCollectionProps) => {
  return (
    <Box>
      <BackButton onClick={props.onBackButtonClick} />
      <Grid container columnSpacing={6} rowSpacing={4} pt={3}>
        <Grid item xs={12} lg={8}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <Typography variant="h2" sx={h2Style}>
                First, you’ll need to deploy a contract
              </Typography>
              <Typography sx={h2Subtext}>
                You’ll need to deploy an ERC-721 contract onto the blockchain
                before you can create a drop.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                  <Typography sx={h3Style}>Collection Details</Typography>
                </Grid>

                <Grid item xs={12}>
                  <ImageUpload
                    title="LOGO IMAGE"
                    helpText=""
                    description1="You may change this after deploying your contract."
                    description2="Recommended size: 350 x 350. File types: JPG, PNG, SVG, or GIF"
                    onFileDrop={(file: File) => {}}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={7} sm={8} md={9}>
                      <TextInput
                        label="CONTRACT NAME"
                        helpText="help"
                        placeholder="My Collection Name"
                        value={props.name}
                        onChange={props.setName}
                      />
                    </Grid>
                    <Grid item xs={5} sm={4} md={3}>
                      <TextInput
                        label="TOKEN SYMBOL"
                        helpText="help"
                        placeholder="MCN"
                        value={props.symbol}
                        onChange={props.setSymbol}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextArea
                    label="DESCRIPTION"
                    helpText="help"
                    placeholder="Provide details description of your collection."
                    value={props.description}
                    onChange={props.setDescription}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextSelect
                    label="CATEGORY"
                    placeholder="My Collection Name"
                    value={props.category}
                    items={props.categories}
                    onChange={props.setCategory}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4}>
          <CollectionPreview
            image={props.previewImage ? props.previewImage : "/nftPreview.png"}
            collectionName={props.name ? props.name : "Collection Name"}
            floorPrice="21.3K"
            volume="42.5K"
          />
        </Grid>
        <Grid item xs={12} display="flex">
          <Button
            sx={{
              display: "inline-block",
              width: "unset",
              mr: 1.5,
            }}
            label="Create Collection"
            onClick={props.onSubmitClick}
          />
          <Button type="secondary" label="Back" onClick={props.onBackButtonClick} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateCollection;
