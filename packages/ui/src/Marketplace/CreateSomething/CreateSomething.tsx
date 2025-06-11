import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { CreateOptionCard } from "../Shared";
import { CreateSomethingProps } from "@phoenix-protocol/types";

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
            {props.title}
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              lineHeight: "25.2px",
              textAlign: "center",
              color: "#BFBFBF",
            }}
          >
            {props.subTitle}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <CreateOptionCard
                title={props.title1}
                description={props.description1}
                onClick={props.option1Click}
              />
            </Grid>
            <Grid item xs={12}>
              <CreateOptionCard
                title={props.title2}
                description={props.description2}
                onClick={props.option2Click}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateSomething;
