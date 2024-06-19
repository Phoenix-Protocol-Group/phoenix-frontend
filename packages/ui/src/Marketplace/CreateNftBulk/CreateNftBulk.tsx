import { Box, Grid, Typography } from "@mui/material";
import { BackButton, TextSelect } from "../Shared";
import React from "react";
import { Button } from "../../Button/Button";
import CreateNftBulkCard from "./CreateNftBulkCard";

export interface CreateNftBulkCardProps {
  id: number;
  image: string;
  name: string;
  description: string;
  onChange: (id: number, key: string, value: string) => void;
}

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

const CreateNftBulk = () => {
  const [category, setCategory] = React.useState("");

  const handleItemChange = (id: number, key: string, value: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );
  };

  const [items, setItems] = React.useState<CreateNftBulkCardProps[]>([
    {
      id: 1,
      image: "/nftPreview.png",
      name: "foo",
      description: "bar",
      onChange: handleItemChange,
    },
    {
      id: 2,
      image: "/nftPreview.png",
      name: "foo",
      description: "bar",
      onChange: handleItemChange,
    },
    {
      id: 3,
      image: "/nftPreview.png",
      name: "foo",
      description: "bar",
      onChange: handleItemChange,
    },
    {
      id: 4,
      image: "/nftPreview.png",
      name: "foo",
      description: "bar",
      onChange: handleItemChange,
    },
  ]);

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
      <Grid container rowSpacing={5}>
        <Grid item xs={12}>
          <Grid container pt={3} rowSpacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h2" sx={h2Style}>
                Create an NFT in Bulk
              </Typography>
              <Typography sx={h2Subtext}>
                Once your item is minted you will not be able to change any of
                its information.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: "flex",
                justifyContent: {xs: "flex-start", md: "flex-end"},
                alignItems: "flex-start",
                pr: 1,
              }}
            >
              <Button
                type="secondary"
                label="+ Add Files"
                onClick={() => {}}
                sx={{
                  padding: "14px 40px",
                }}
              />
              <Button
                label="Create Items"
                onClick={() => {}}
                sx={{
                  padding: "14px 40px",
                  ml: 1.5,
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <Typography sx={h3Style}>Collection Details</Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm>
                  <TextSelect
                    label="CATEGORY"
                    placeholder="My Collection Name"
                    helpText="help"
                    value={category}
                    onChange={setCategory}
                    items={categoryItems}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm="auto"
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    pt: 3,
                    "& > div": {
                      width: {
                        xs: "100% !important",
                        sm: "auto !important"
                      }
                    }
                  }}
                >
                  <Button
                    label="Create Collection"
                    type="secondary"
                    onClick={() => {}}
                    sx={{
                      padding: "14px 40px",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <Typography sx={h3Style}>NFTs</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {items.map((item: CreateNftBulkCardProps, index: number) => (
                  <Grid item xs={12} sm={4} md={3} key={index}>
                    <CreateNftBulkCard {...item} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateNftBulk;
