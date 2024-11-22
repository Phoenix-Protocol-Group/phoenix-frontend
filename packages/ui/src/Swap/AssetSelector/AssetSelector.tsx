import React, { useState, useMemo } from "react";
import { Box, Grid, IconButton, Input, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { AssetSelectorProps } from "@phoenix-protocol/types";
import AssetItem from "./AssetItem";

/**
 * AssetSelector
 * A modern and searchable token selector modal with quick select and token list sections.
 *
 * @param {AssetSelectorProps} props - Props containing token data and event handlers.
 * @returns {JSX.Element}
 */
const AssetSelector = ({
  tokens,
  tokensAll,
  onClose,
  onTokenClick,
  hideQuickSelect,
}: AssetSelectorProps) => {
  const [searchValue, setSearchValue] = useState("");

  /**
   * Filters tokens based on the search value.
   * Memoized for performance optimization.
   */
  const filteredTokens = useMemo(() => {
    return tokensAll.filter((token) =>
      token.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [tokensAll, searchValue]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Box
        sx={{
          width: "100%",
          padding: "1.5rem",
          background:
            "linear-gradient(180deg, #292B2C 0%, #222426 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          borderRadius: "16px",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              borderRadius: "8px",
              background:
                "linear-gradient(180deg, #292B2C 0%, #222426 100%),linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
              padding: "0.5rem",
              marginRight: "1rem",
            }}
          >
            <KeyboardArrowLeft sx={{ color: "white" }} />
          </IconButton>
          <Typography
            sx={{
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Select Token
          </Typography>
        </Box>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
              color: "white",
              fontSize: "14px",
              marginBottom: "16px",
              "&:before, &:after": { content: "none" },
            }}
            startAdornment={
              <img
                style={{ marginRight: "8px" }}
                src="/MagnifyingGlass.svg"
                alt="Search"
              />
            }
          />
        </motion.div>

        {/* Quick Select Section */}
        {!hideQuickSelect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Box
              sx={{
                borderRadius: "16px",
                padding: "1rem",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
                marginBottom: "16px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "1rem",
                }}
              >
                Quick select
              </Typography>
              <Grid container spacing={1}>
                {tokens.slice(0, 4).map((token, index) => (
                  <Grid key={index} item xs={4} sm={3}>
                    <AssetItem token={token} onClick={onTokenClick} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        )}

        {/* All Tokens Section */}
        <Box
          sx={{
            borderRadius: "16px",
            padding: "1rem",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "1rem",
            }}
          >
            All tokens
          </Typography>
          <Box
            sx={{
              maxHeight: "30vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#E2491A",
                borderRadius: "8px",
              },
            }}
          >
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token, index) => (
                <AssetItem key={index} token={token} onClick={onTokenClick} />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <Box
                  component="img"
                  src="/search-not-found.svg"
                  alt="No assets found"
                  sx={{ maxWidth: "160px", marginBottom: "1rem" }}
                />
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 400,
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  We didn’t find any assets for "{searchValue}"
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export { AssetSelector };
