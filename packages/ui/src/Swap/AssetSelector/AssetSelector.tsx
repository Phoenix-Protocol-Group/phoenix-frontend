import React, { useState, useMemo } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { AssetSelectorProps } from "@phoenix-protocol/types";
import AssetItem from "./AssetItem";
import { SearchInput } from "../../Common/SearchInput";
import { colors, typography, spacing, borderRadius, shadows } from "../../Theme/styleConstants";
import { CardContainer } from "../../Common/CardContainer";

/**
 * AssetSelector
 * A modern and searchable token selector modal with quick select and token list sections.
 */
export const AssetSelector = ({
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
      <CardContainer
        sx={{
          width: "100%",
          padding: spacing.lg,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: spacing.md,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              borderRadius: borderRadius.sm,
              color: colors.neutral[300],
              background: colors.neutral[800],
              padding: spacing.sm,
              marginRight: spacing.md,
              "&:hover": {
                background: colors.neutral[700],
              },
            }}
          >
            <KeyboardArrowLeft sx={{ color: "inherit" }} />
          </IconButton>
          <Typography
            sx={{
              color: colors.neutral[50],
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeights.medium,
              fontFamily: typography.fontFamily,
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
          <SearchInput
            placeholder="Search by name or address"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ marginBottom: spacing.md }}
          />
        </motion.div>

        {/* Quick Select Section */}
        {!hideQuickSelect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <CardContainer sx={{ marginBottom: spacing.md }}>
              <Typography
                sx={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium,
                  color: colors.neutral[400],
                  marginBottom: spacing.md,
                  fontFamily: typography.fontFamily,
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
            </CardContainer>
          </motion.div>
        )}

        {/* All Tokens Section */}
        <CardContainer>
          <Typography
            sx={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeights.medium,
              color: colors.neutral[400],
              marginBottom: spacing.md,
              fontFamily: typography.fontFamily,
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
                backgroundColor: colors.primary.main,
                borderRadius: borderRadius.sm,
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
                  padding: spacing.md,
                }}
              >
                <Box
                  component="img"
                  src="/search-not-found.svg"
                  alt="No assets found"
                  sx={{ maxWidth: "160px", marginBottom: spacing.md, opacity: 0.6 }}
                />
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeights.regular,
                    color: colors.neutral[400],
                    fontFamily: typography.fontFamily,
                  }}
                >
                  We didn't find any assets for "{searchValue}"
                </Typography>
              </Box>
            )}
          </Box>
        </CardContainer>
      </CardContainer>
    </motion.div>
  );
};
