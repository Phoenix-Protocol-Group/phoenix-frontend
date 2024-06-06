import { Box, Fade, Grid, Typography } from "@mui/material";
import React from "react";
import RisingStarsCard from "./RisingStarsCard";

const tabUnselectedStyles = {
  display: "flex",
  width: "2.75rem",
  height: "2.3125rem",
  padding: "1.125rem 1.5rem",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.625rem",
  borderRadius: "1rem",
  cursor: "pointer",
  background:
    "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
  color: "#FFF",
  opacity: 0.6,
  textAlign: "center",
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily: "Ubuntu",
  fontSize: "0.625rem",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "1.25rem", // 200%
};

const tabSelectedStyles = {
  display: "flex",
  height: "2.25rem",
  padding: "1.125rem 1.5rem",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.625rem",
  flex: "1 0 0",
  borderRadius: "1rem",
  border: "1px solid var(--Primary-P3, #E2571C)",
  background: "rgba(226, 73, 26, 0.10)",
  color: "#FFF",
  opacity: 1,
  textAlign: "center",
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily: "Ubuntu",
  fontSize: "0.625rem",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "1.25rem", // 200%
};

export interface RisingStarCardProps {
  image: string;
  collectionName: string;
  percent: number;
}

export interface RisingStarsProps {
  entries: RisingStarCardProps[];
  activeTime: "6h" | "1d" | "7d" | "30d";
  setActiveTime: (time: "6h" | "1d" | "7d" | "30d") => void;
}

const RisingStars = (props: RisingStarsProps) => {
  const [ready, setReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    setReady(true);
  }, [props.entries]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: "#FFF",
            fontFamily: "Ubuntu",
            fontSize: "2rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            flex: 1,
          }}
        >
          Rising Stars
        </Typography>
        <Box display="flex">
          <Box
            mr={0.5}
            sx={
              props.activeTime === "6h"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveTime("6h")}
          >
            6H
          </Box>
          <Box
            mr={0.5}
            sx={
              props.activeTime === "1d"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveTime("1d")}
          >
            1D
          </Box>
          <Box
            mr={0.5}
            sx={
              props.activeTime === "7d"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveTime("7d")}
          >
            7D
          </Box>
          <Box
            sx={
              props.activeTime === "30d"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveTime("30d")}
          >
            30D
          </Box>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {props.entries
          .map((item: RisingStarCardProps, index: number) => (
            <Fade
              key={index}
              in={ready}
              {...(ready ? { timeout: index * 500 } : {})}
              unmountOnExit
            >
              <Grid item xs={6} md={3} lg={4}>
                <RisingStarsCard {...item} />
              </Grid>
            </Fade>
          ))}
      </Grid>
    </Box>
  );
};

export default RisingStars;
