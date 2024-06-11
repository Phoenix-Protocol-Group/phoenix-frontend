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

const CreateCollection = () => {
  const [collectionName, setCollectionName] = React.useState("");
  const [tokenSymbol, setTokenSymbol] = React.useState("");
  const [description, setDescription] = React.useState("");

  const categoryItems = [
    {
      value: "foo",
      label: "Foo",
    },
    {
      value: "bar",
      label: "Bar",
    },
  ];

  const [category, setCategory] = React.useState("foo");

  return (
    <Box>
      <BackButton onClick={() => {}} />
      <Grid container columnSpacing={6} rowSpacing={4} pt={3}>
        <Grid item xs={12} md={9}>
          <Grid container rowSpacing={5}>
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
                    <Grid item xs={7} sm={8} md={10}>
                      <TextInput
                        label="CONTRACT NAME"
                        helpText="help"
                        placeholder="My Collection Name"
                        value={collectionName}
                        onChange={setCollectionName}
                      />
                    </Grid>
                    <Grid item xs={5} sm={8} md={2}>
                      <TextInput
                        label="TOKEN SYMBOL"
                        helpText="help"
                        placeholder="MCN"
                        value={tokenSymbol}
                        onChange={setTokenSymbol}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextArea
                    label="DESCRIPTION"
                    helpText="help"
                    placeholder="Provide details description of your collection."
                    value={description}
                    onChange={setDescription}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextSelect
                    label="CATEGORY"
                    value={category}
                    items={categoryItems}
                    onChange={setCategory}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <CollectionPreview
            image="/nftPreview.png"
            collectionName="Collection Name"
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
          />
          <Button type="secondary" label="Back" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateCollection;
