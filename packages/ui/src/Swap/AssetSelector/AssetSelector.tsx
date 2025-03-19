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
          background: "var(--neutral-900, #171717)", // Adjusted background
          border: "1px solid var(--neutral-700, #404040)", // Adjusted border
          borderRadius: "12px", // Reduced border radius
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
              color: "var(--neutral-300, #D4D4D4)", // Adjusted color
              background: "var(--neutral-800, #262626)", // Adjusted background
              padding: "0.5rem",
              marginRight: "1rem",
              "&:hover": {
                background: "var(--neutral-700, #404040)", // Adjusted background on hover
              },
            }}
          >
            <KeyboardArrowLeft sx={{ color: "inherit" }} />
          </IconButton>
          <Typography
            sx={{
              color: "var(--neutral-50, #FAFAFA)", // Adjusted color
              fontSize: "1.25rem", // Adjusted font size
              fontWeight: 500, // Adjusted font weight
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
              borderRadius: "12px", // Reduced border radius
              border: "1px solid var(--neutral-700, #404040)", // Adjusted border
              background: "var(--neutral-800, #262626)", // Adjusted background
              padding: "8px 12px", // Adjusted padding
              color: "var(--neutral-300, #D4D4D4)", // Adjusted color
              fontSize: "14px",
              marginBottom: "16px",
              "&:before, &:after": { content: "none" },
            }}
            startAdornment={
              <img
                style={{ marginRight: "8px", opacity: 0.6 }} // Adjusted opacity
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
                borderRadius: "12px", // Reduced border radius
                padding: "1rem",
                background: "var(--neutral-900, #171717)", // Adjusted background
                border: "1px solid var(--neutral-700, #404040)", // Adjusted border
                marginBottom: "16px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500, // Adjusted font weight
                  color: "var(--neutral-400, #A3A3A3)", // Adjusted color
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
            borderRadius: "12px", // Reduced border radius
            padding: "1rem",
            background: "var(--neutral-900, #171717)", // Adjusted background
            border: "1px solid var(--neutral-700, #404040)", // Adjusted border
          }}
        >
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500, // Adjusted font weight
              color: "var(--neutral-400, #A3A3A3)", // Adjusted color
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
                backgroundColor: "#F97316", // Adjusted color
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
                  sx={{ maxWidth: "160px", marginBottom: "1rem", opacity: 0.6 }} // Adjusted opacity
                />
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 400,
                    color: "var(--neutral-400, #A3A3A3)", // Adjusted color
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
