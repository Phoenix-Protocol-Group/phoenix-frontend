import { Box, Grid } from "@mui/material";
import React from "react";
import { CreateNftBulkCardProps } from "./CreateNftBulk";
import { TextArea, TextInput } from "../Shared";
import { Button } from "../../Button/Button";

const CreateNftBulkCard = (props: CreateNftBulkCardProps) => {
  const handleChange = (val: string, name: string) => {
    props.onChange(props.id, name, val);
  };

  return (
    <Box
      sx={{
        borderRadius: "16px",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
        border: "1px solid #2C2C31",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          objectFit: "cover",
        }}
        alt="NFT Preview Image"
        src={props.image}
      />
      <Grid container rowSpacing={1} sx={{
        background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
        p: 2,
        boxShadow: "0px -4px 12px 0px #00000059",
      }}>
        <Grid item xs={12}>
          <TextInput
            placeholder="NFT Name"
            name="name"
            value={props.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextArea
            placeholder="NFT Description"
            name="description"
            value={props.description}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateNftBulkCard;
