import { Box, Grid, Typography } from "@mui/material";
import {
  BackButton,
  ImageUpload,
  TextArea,
  TextInput,
  TextSelect,
  Divider,
  NftPreview,
} from "../Shared";
import React from "react";
import { Button } from "../../Button/Button";
import { CreateNftProps } from "@phoenix-protocol/types";

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

const CreateNft = (props: CreateNftProps) => {
  return (
    <Box>
      <BackButton onClick={props.onBackButtonClick} />
      <Grid container columnSpacing={6} rowSpacing={4} pt={3}>
        <Grid item xs={12} lg={8}>
          <Grid container rowSpacing={5}>
            <Grid item xs={12}>
              <Typography variant="h2" sx={h2Style}>
                Create an NFT
              </Typography>
              <Typography sx={h2Subtext}>
                Once your item is minted you will not be able to change any of
                its information.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                  <Typography sx={h3Style}>Collection Details</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm>
                      <TextSelect
                        label="CATEGORY"
                        helpText="help"
                        placeholder="My Collection Name"
                        value={props.category}
                        onChange={props.setCategory}
                        items={props.categories}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm="auto"
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        "& > div": {
                          width: {
                            xs: "100% !important",
                            sm: "auto !important",
                          },
                        },
                      }}
                    >
                      <Button
                        label="Create Collection"
                        onClick={props.onCreateCollectionClick}
                        sx={{
                          padding: "14px 40px",
                          marginTop: {
                            xs: "-8px",
                            md: "32px",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <ImageUpload
                    title="Drag and drop or click to upload"
                    helpText=""
                    description1="Max size 50 MB. File types: JPG, PNG, SVG, MP4 or GIF"
                    onFileDrop={(file: File) => {
                      props.setFile(file);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={7} sm={9} md={10}>
                      <TextInput
                        label="NAME"
                        helpText="help"
                        placeholder="Name your NFT"
                        value={props.name}
                        onChange={props.setName}
                      />
                    </Grid>
                    <Grid item xs={5} sm={3} md={2}>
                      <TextInput
                        label="SUPPLY"
                        helpText="help"
                        placeholder="1"
                        value={props.supply}
                        onChange={props.setSupply}
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
                  <TextInput
                    label="EXTERNAL LINK"
                    placeholder="https://www.yoursite.io/item/2137"
                    value={props.externalLink}
                    onChange={props.setExternalLink}
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
          <NftPreview
            image={props.previewImage ? props.previewImage : "/nftPreview.png"}
            collectionName={props.category ? props.category : "Collection Name"}
            nftName={props.name ? props.name : "NFT Name"}
            price="21.3K"
            ownedBy="You"
          />
        </Grid>
        <Grid item xs={12} display="flex">
          <Button
            sx={{
              display: "inline-block",
              width: "unset",
              mr: 1.5,
            }}
            label="Create Item"
            onClick={props.onSubmitClick}
          />
          <Button type="secondary" label="Back" onClick={props.onBackButtonClick} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateNft;
