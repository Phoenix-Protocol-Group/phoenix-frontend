import React from "react";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ExpandMore, Search, Tune } from "@mui/icons-material";
import NftListingEntry from "./NftListingEntry";

export interface NftListingProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  order: string;
  orderItems: {
    value: string;
    label: string;
  }[];
  setOrder: (order: string) => void;
  activeCurrency: "crypto" | "usd";
  setActiveCurrency: (view: "crypto" | "usd") => void;
  nftEntries: NftListingEntryProps[];
}

export interface NftListingEntryProps {
  id: string;
  image: string;
  collectionName: string;
  nftName: string;
  price: string;
  ownedBy: string;
}

const outlinedIconButtonStyle = {
  border: "1px solid #2C2C31",
  background: "transparent !important",
  color: "white",
  padding: "8px 16px !important",
  borderRadius: "8px",
  fontSize: "14px",
  lineHeight: "20px",
  display: "flex",
  gap: 1,
  fontWeight: 500,
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
  color: "rgba(255, 255, 255, 0.6)",
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
  borderRadius: "1rem",
  border: "1px solid var(--Primary-P3, #E2571C)",
  background: "rgba(226, 73, 26, 0.10)",
  color: "#FFF",
  textAlign: "center",
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily: "Ubuntu",
  fontSize: "0.625rem",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "1.25rem", // 200%
};

const NftListing = (props: NftListingProps) => {
  return (
    <Box>
      <Grid
        container
        sx={{
          borderRadius: "24px",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
          p: 3,
          gap: 3,
        }}
      >
        <Grid item xs={12}>
          <Grid container gap={2.5}>
            <Grid item xs="auto" display={{
              xs: "none",
              sm: "block"
            }}>
              <Button
                sx={{
                  ...outlinedIconButtonStyle,
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%) !important",
                  border: "1px solid #2C2C31",
                }}
              >
                <Tune sx={{ fontSize: "16px" }} />
                Filters
                <ExpandMore sx={{ fontSize: "16px" }} />
              </Button>
            </Grid>
            <Grid item xs={12} sm>
              <TextField
                id="search"
                type="search"
                value={props.searchTerm}
                placeholder="Search by Collection"
                sx={{
                  color: "white",
                  width: "100%",
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px",
                    lineHeight: "24px",
                  },
                }}
                onChange={(e) => props.setSearchTerm(e.target.value)}
                InputLabelProps={{
                  sx: {
                    color: "white!important",
                    fontSize: "14px",
                    lineHeight: "24px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        sx={{
                          fontSize: "20px",
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      />
                    </InputAdornment>
                  ),
                  sx: {
                    color: "white",
                    width: "100%",
                    fontSize: "14px",
                    lineHeight: "24px",
                    borderRadius: "8px",
                    padding: "9px 24px !important",
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
                    "& fieldset": {
                      border: "1px solid #2C2C31 !important",
                    },
                    "& input": {
                      padding: 0,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs sm="auto">
              <Select
                value={props.order}
                onChange={(e) => props.setOrder(e.target.value)}
                sx={{
                  boxShadow: "none",
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #2C2C31 !important",
                  },
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
                  borderRadius: "8px",
                  "& .MuiSelect-select": {
                    padding: "7px 12px",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px",
                    lineHeight: "24px",
                  },
                }}
              >
                {props.orderItems.map((item: any, index: number) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs="auto" display="flex">
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
                sx={
                  props.activeCurrency === "usd"
                    ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                    : tabUnselectedStyles
                }
                onClick={() => props.setActiveCurrency("usd")}
              >
                USD
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1.5}>
            {props.nftEntries.map((entry: any, index: number) => (
              <Grid item xs={6} sm={4} md={3} lg={12 / 5} key={index}>
                <NftListingEntry {...entry} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NftListing;
