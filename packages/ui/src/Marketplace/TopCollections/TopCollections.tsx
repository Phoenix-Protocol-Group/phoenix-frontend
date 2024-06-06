import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import TopCollectionsHeader from "./TopCollectionsHeader";
import TopCollectionsEntry from "./TopCollectionsEntry";

const BoxStyle = {
  p: 2,
  borderRadius: "8px",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
};

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

const scrollbarStyles = {
  /* Firefox */
  scrollbarWidth: "thin",
  scrollbarColor: "#E2491A #1B1B1B",

  /* Chrome, Edge, and Safari */
  "&::-webkit-scrollbar": {
    width: "4px",
  },

  "&::-webkit-scrollbar-track": {
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%);",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#E2491A",
    borderRadius: "8px",
  },
};

const headerRightAligned = {
  display: "flex",
  justifyContent: "flex-end",
  pr: 0.5
}

export interface TopCollectionsEntryProps {
  _key?: number; //only used for loop key
  id: string;
  previewImage: string;
  collectionName: string;
  floorPrice: string;
  bestOffer: string;
  volume: string;
  volumePercent?: string;
  owners: string;
  ownersPercent?: string;
  forSalePercent: string;
  forSaleNumbers: string;
}

export interface TopCollectionsProps {
  entries: TopCollectionsEntryProps[];
  activeSort: {
    column:
      | "collection"
      | "floorPrice"
      | "bestOffer"
      | "volume"
      | "owners"
      | "forSale"
      | undefined;
    direction: "asc" | "desc";
  };
  handleSort: (column: string) => void;
  activeCurrency: "crypto" | "usd";
  setActiveCurrency: (view: "crypto" | "usd") => void;
  activeTime: "6h" | "1d" | "7d" | "30d";
  setActiveTime: (time: "6h" | "1d" | "7d" | "30d") => void;
  onViewAllClick: () => void;
}

const TopCollections = (props: TopCollectionsProps) => {
  return (
    <Box
      sx={{
        mt: 2,
        p: 3,
        borderRadius: 3,
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        overflowX: "auto",
        ...scrollbarStyles,
      }}
    >
      <Box
        sx={{
          display: "flex",
          mb: 3,
          justifyContent: "space-between",
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
            mr: 2
          }}
        >
          Top Collections
        </Typography>
        <Box display="flex">
          <Box
            mr={0.5}
            sx={
              props.activeCurrency === "crypto"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveCurrency("crypto")}
          >
            Crypto
          </Box>
          <Box
            mr={2}
            sx={
              props.activeCurrency === "usd"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveCurrency("usd")}
          >
            USD
          </Box>
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
            mr={2}
            sx={
              props.activeTime === "30d"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveTime("30d")}
          >
            30D
          </Box>
          <Box
            sx={{
              display: "flex",
              height: "2.3125rem",
              padding: "1.125rem 0.7rem 1.125rem 1rem",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "1rem",
              cursor: "pointer",
              background:
                "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
              color: "#FFF",
              textAlign: "center",
              fontSize: "0.625rem",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "1.25rem", // 2
            }}
            onClick={props.onViewAllClick}
          >
            <Box mr={0.5} whiteSpace="nowrap">View All</Box><ArrowRightAltIcon sx={{fontSize: "16px"}} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ ...BoxStyle, mb: 2, minWidth: "700px" }}>
        <Grid container>
          <Grid item xs={3}>
            <TopCollectionsHeader
              handleSort={props.handleSort}
              label="collection"
              active={
                props.activeSort.column === "collection"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
          <Grid item xs={2} sx={headerRightAligned}>
            <TopCollectionsHeader
              handleSort={props.handleSort}
              label="floor price"
              active={
                props.activeSort.column === "floorPrice"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
          <Grid item xs={2} sx={headerRightAligned}>
            <TopCollectionsHeader
              handleSort={props.handleSort}
              label="best offer"
              active={
                props.activeSort.column === "bestOffer"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
          <Grid item xs={2} sx={headerRightAligned}>
            <TopCollectionsHeader
              handleSort={props.handleSort}
              label="volume"
              active={
                props.activeSort.column === "volume"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
          <Grid item xs={2} sx={headerRightAligned}>
            <TopCollectionsHeader
              handleSort={props.handleSort}
              label="owners"
              active={
                props.activeSort.column === "owners"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
          <Grid item xs={1} sx={headerRightAligned}>
            <TopCollectionsHeader
              handleSort={props.handleSort}
              label="for sale"
              active={
                props.activeSort.column === "forSale"
                  ? props.activeSort.direction
                  : false
              }
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ minWidth: "700px" }}>
        {props.entries.length ? (
          props.entries.map((entry, index) => (
            <TopCollectionsEntry _key={index} {...entry}/>
          ))
        ) : (
          <Box>
            <Typography
              sx={{
                color: "#FFF",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pt: 1
              }}
            >
              No collections found.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TopCollections;
