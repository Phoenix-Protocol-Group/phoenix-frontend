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

const CreateNft = () => {
  const [category, setCategory] = React.useState("");
  const [nftName, setNftName] = React.useState("");
  const [nftSupply, setNftSupply] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [externalLink, setExternalLink] = React.useState("");

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

  return (
    <Box>
      <BackButton onClick={() => {}} />
      <Grid container columnSpacing={6} rowSpacing={4} pt={3}>
        <Grid item xs={12} md={9}>
          <Grid container rowSpacing={5}>
            <Grid item xs={12}>
              <Typography variant="h2" sx={h2Style}>
                Create an NFT
              </Typography>
              <Typography sx={h2Subtext}>
                Once your item is minted you will not be able to change any of its information.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                  <Typography sx={h3Style}>Collection Details</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={8} md={9}>
                      <TextSelect
                        label="CATEGORY"
                        helpText="help"
                        placeholder="My Collection Name"
                        value={category}
                        onChange={setCategory}
                        items={categoryItems}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8} md={3}>
                      <Button
                        label="Create Collection"
                        onClick={() => {}}
                        sx={{
                          padding: "14px 40px",
                          marginTop: {
                            xs: "-8px",
                            md: "32px"
                          }
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
                      setFile(file);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={7} sm={8} md={10}>
                      <TextInput
                        label="NAME"
                        helpText="help"
                        placeholder="Name your NFT"
                        value={nftName}
                        onChange={setNftName}
                      />
                    </Grid>
                    <Grid item xs={5} sm={8} md={2}>
                      <TextInput
                        label="SUPPLY"
                        helpText="help"
                        placeholder="1"
                        value={nftSupply}
                        onChange={setNftSupply}
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
                  <TextInput
                    label="EXTERNAL LINK"
                    placeholder="https://www.yoursite.io/item/2137"
                    value={externalLink}
                    onChange={setExternalLink}
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
          <NftPreview
            image="/nftPreview.png"
            collectionName="Collection Name"
            nftName="NFT Name"
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
            onClick={() => {}}
          />
          <Button type="secondary" label="Back" onClick={() => {}} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateNft;
