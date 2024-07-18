import { Box, Grid, Typography } from "@mui/material";
import { BackButton, TextSelect } from "../Shared";
import React from "react";
import { Button } from "../../Button/Button";
import CreateNftBulkCard from "./CreateNftBulkCard";
import { CreateNftBulkEntryProps, CreateNftBulkProps } from "@phoenix-protocol/types";

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

const CreateNftBulk = (props: CreateNftBulkProps) => {
  const handleItemChange = (id: number, key: string, value: string) => {
    const newEntries = props.entries.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    );

    props.setEntries(newEntries);
  };

  const handleClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = "image/*";
    fileInput.onchange = (event: any) => {
      if (event.target.files && event.target.files.length > 0) {
        const newEntries: CreateNftBulkEntryProps[] = Array.from(event.target.files).map((file: File, index) => ({
          id: index,
          file: file,
          name: file.name.split(".")[0] || "NFT Name",
          description: "Your awesome Description"
        }));
    
        props.setEntries((prevEntries) => [...prevEntries, ...newEntries]);
      }
    };
    fileInput.click();
  };

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
      <BackButton onClick={props.onBackButtonClick} />
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
                onClick={handleClick}
                sx={{
                  padding: "14px 40px",
                }}
              />
              <Button
                label="Create Items"
                onClick={props.onSubmitClick}
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
                    value={props.category}
                    onChange={props.setCategory}
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
                    onClick={props.onCreateCollectionClick}
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
                {props.entries.map((item: CreateNftBulkEntryProps) => (
                  <Grid item xs={12} sm={4} md={3} key={item.id}>
                    <CreateNftBulkCard {...item} onChange={handleItemChange}/>
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
