import React, { useState } from "react";
import { Box, Grid, IconButton, Input, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { AssetSelectorProps } from "@phoenix-protocol/types";
import AssetItem from "./AssetItem";

const containerStyle = {
  borderRadius: "16px",
  background:
    "linear-gradient(180deg, #292B2C 0%, #222426 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
  padding: "16px",
  marginBottom: "16px",
};

const headerStyle = {
  fontSize: "13px",
  lineHeight: "18px",
  marginBottom: "18px",
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

const AssetSelector = ({
  tokens,
  tokensAll,
  onClose,
  onTokenClick,
  hideQuickSelect,
}: AssetSelectorProps) => {
  const [searchValue, setSearchValue] = useState("");

  const getFilteredTokens = () => {
    return tokensAll.filter((token) =>
      token.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            marginBottom: "16px",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              maxWidth: "32px",
              maxHeight: "32px",
              margin: "8px 16px 0 0",
              borderRadius: "8px",
              background:
                "linear-gradient(180deg, #292B2C 0%, #222426 100%),linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Typography
            sx={{
              color: "white",
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            Select Token
          </Typography>
        </Box>
        <Input
          placeholder="Search by name or address"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchValue(e.target.value)
          }
          sx={{
            width: "100%",
            borderRadius: "16px",
            border: "1px solid #2D303A",
            background: "#1D1F21",
            padding: "8px 16px",
            lineHeight: "18px",
            fontSize: "13px",
            marginBottom: "16px",
            "&:before": {
              content: "none",
            },
            "&:after": {
              content: "none",
            },
          }}
          startAdornment={
            <img
              style={{ marginRight: "8px" }}
              src="/MagnifyingGlass.svg"
              alt="Search"
            />
          }
        />
        {!hideQuickSelect && (
          <Box sx={containerStyle}>
            <Typography sx={headerStyle}>Quick select</Typography>
            <Grid container spacing={1}>
              {tokens.map((token, index) => (
                <Grid key={index} item xs={4} md={2}>
                  <AssetItem token={token} onClick={onTokenClick} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <Box sx={containerStyle}>
          <Typography sx={headerStyle}>All tokens</Typography>
          <Box
            sx={{
              maxHeight: "30vh",
              overflow: "auto",
              ...scrollbarStyles,
              paddingRight: "8px",
            }}
          >
            {getFilteredTokens().map((token, index) => (
              <AssetItem key={index} token={token} onClick={onTokenClick} />
            ))}
            <Box
              sx={{
                display: getFilteredTokens().length ? "none" : "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src="/search-not-found.svg"
                alt="No assets found"
                sx={{
                  maxWidth: "160px",
                }}
              />
              <Typography
                sx={{
                  lineHeight: "18px",
                  fontSize: "14px",
                  fontWeight: "400",
                  color:
                    "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
                }}
              >
                We didn’t find any assets for {searchValue}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export { AssetSelector };
