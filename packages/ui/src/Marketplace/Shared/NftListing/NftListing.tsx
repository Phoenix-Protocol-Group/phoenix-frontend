import React from "react";
import {
  Box,
  Grid,
  Button as MuiButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from "@mui/material";
import { Button } from "../../../Button/Button";
import { ExpandMore, ExpandLess, Search, Tune } from "@mui/icons-material";
import NftListingEntry from "./NftListingEntry";
import TextInput from "../TextInput/TextInput";
import { AuctionStatus, AuctionType, NftListingProps } from "@phoenix-protocol/types";

const outlinedIconButtonStyle = {
  border: "1px solid #2C2C31",
  background: "transparent !important",
  color: "white",
  padding: "8px 12px 8px 16px !important",
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
  const [showFilter, setShowFilter] = React.useState(false);

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
          <Grid
            container
            gap={{
              xs: 1.5,
              sm: 2.5,
            }}
          >
            <Grid item xs="auto">
              <MuiButton
                onClick={() => setShowFilter(!showFilter)}
                sx={{
                  ...outlinedIconButtonStyle,
                  display: {
                    xs: "none",
                    sm: "flex",
                  },
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%) !important",
                  border: "1px solid #2C2C31",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                <Tune sx={{ fontSize: "16px" }} />
                Filters
                {showFilter ? <ExpandLess sx={{ fontSize: "16px" }} /> : <ExpandMore sx={{ fontSize: "16px" }} />}
              </MuiButton>
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
                IconComponent={() => <ExpandMore sx={{fontSize: "16px", marginRight: "12px", color: "rgba(255, 255, 255, 0.6)"}}/>}
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
            <Grid
              item
              xs={12}
              sm="auto"
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "space-between",
                  sm: "flex-start",
                },
              }}
            >
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
                  mr={1}
                  sx={
                    props.activeCurrency === "usd"
                      ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                      : tabUnselectedStyles
                  }
                  onClick={() => props.setActiveCurrency("usd")}
                >
                  USD
                </Box>
              </Box>
              <MuiButton
                onClick={() => setShowFilter(!showFilter)}
                sx={{
                  ...outlinedIconButtonStyle,
                  display: {
                    xs: "flex",
                    sm: "none",
                  },
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%) !important",
                  border: "1px solid #2C2C31",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                <Tune sx={{ fontSize: "16px" }} />
                Filters
                {showFilter ? <ExpandLess sx={{ fontSize: "16px" }} /> : <ExpandMore sx={{ fontSize: "16px" }} />}
              </MuiButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} display="flex">
          <Box
            sx={{
              width: { xs: "100%", sm: "256px" },
              display: showFilter ? "block" : "none",
              overflow: "hidden",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
              border: "1px solid #2C2C31",
              borderRadius: "16px",
              mr: { xs: 0, sm: 2 },
              p: 2,
            }}
          >
            <Grid container rowSpacing={3}>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: "24px",
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                >
                  Price
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <TextInput
                    placeholder="Min"
                    value={props.minPrice}
                    onChange={props.setMinPrice}
                  />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    to
                  </Typography>
                  <TextInput
                    placeholder="Max"
                    value={props.maxPrice}
                    onChange={props.setMaxPrice}
                  />
                </Box>
                <Button
                  label="Apply"
                  sx={{
                    fontSize: "14px",
                    lineHeight: "16px",
                    fontWeight: 700,
                    padding: "12px 40px 12px 40px",
                    width: "100%",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: "24px",
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                >
                  Status
                </Typography>
                <FormControl>
                  <RadioGroup
                    value={props.status}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      props.setStatus(e.target.value as AuctionStatus);
                    }}
                    sx={{
                      marginLeft: "3px",
                      "& .MuiRadio-root": {
                        padding: "6px",
                      },
                      "& .MuiFormControlLabel-label": {
                        fontSize: "14px",
                        lineHeight: "20px",
                      },
                      "& .MuiSvgIcon-root": {
                        height: 20,
                        width: 20,
                      },
                    }}
                  >
                    <FormControlLabel
                      value="ALL"
                      control={<Radio />}
                      label="All"
                    />
                    <FormControlLabel
                      value="NOW"
                      control={<Radio />}
                      label="Buy now"
                    />
                    <FormControlLabel
                      value="AUCTION"
                      control={<Radio />}
                      label="Live auction"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: "24px",
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                >
                  Status
                </Typography>
                <FormControl>
                  <RadioGroup
                    value={props.type}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      props.setType(e.target.value as AuctionType);
                    }}
                    sx={{
                      marginLeft: "3px",
                      "& .MuiRadio-root": {
                        padding: "6px",
                      },
                      "& .MuiFormControlLabel-label": {
                        fontSize: "14px",
                        lineHeight: "20px",
                      },
                      "& .MuiSvgIcon-root": {
                        height: 20,
                        width: 20,
                      },
                    }}
                  >
                    <FormControlLabel
                      value="ALL"
                      control={<Radio />}
                      label="All"
                    />
                    <FormControlLabel
                      value="NOW"
                      control={<Radio />}
                      label="Buy now"
                    />
                    <FormControlLabel
                      value="AUCTION"
                      control={<Radio />}
                      label="Live auction"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Grid
            container
            spacing={1.5}
            sx={{
              display: {
                xs: showFilter ? "none" : "flex",
                sm: "flex",
              },
            }}
          >
            {props.nftEntries.map((entry: any, index: number) => (
              <Grid item xs={6} sm={4} md={3} lg={12 / 5} key={index}>
                <NftListingEntry
                  _listForSaleClick={props.listForSaleClick}
                  {...entry}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NftListing;
