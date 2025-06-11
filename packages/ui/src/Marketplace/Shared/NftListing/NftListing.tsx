import React from "react";
import { Box, Grid, Typography, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowForward, Star, TrendingUp } from "@mui/icons-material";
import NftListingEntry from "./NftListingEntry";
import { NftListingProps } from "@phoenix-protocol/types";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  cardStyles,
} from "../../../Theme/styleConstants";

const RecentNfts = (props: NftListingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: spacing.xl,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: spacing.md }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.primary.main}20, ${colors.primary.dark}10)`,
                border: `1px solid ${colors.primary.main}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Star
                sx={{
                  fontSize: "24px",
                  color: colors.primary.main,
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: typography.fontSize["2xl"],
                  fontWeight: typography.fontWeights.bold,
                  fontFamily: typography.fontFamily,
                  lineHeight: 1.2,
                  mb: spacing.xs,
                }}
              >
                Recent NFTs
              </Typography>
              <Typography
                sx={{
                  color: colors.neutral[400],
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                Discover the latest NFT drops and trending collections
              </Typography>
            </Box>
          </Box>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              sx={{
                color: colors.neutral[300],
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.neutral[700]}`,
                background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
                transition: "all 0.3s ease",
                "&:hover": {
                  border: `1px solid ${colors.primary.main}60`,
                  color: colors.primary.main,
                  background: `linear-gradient(135deg, ${colors.neutral[750]}60 0%, ${colors.neutral[850]}80 100%)`,
                },
              }}
            >
              <ArrowForward sx={{ fontSize: "20px" }} />
            </IconButton>
          </motion.div>
        </Box>

        {/* NFTs Grid */}
        <Grid container spacing={spacing.lg}>
          {props.nftEntries.slice(0, 8).map((entry, index) => (
            <Grid item xs={6} sm={4} md={3} key={entry.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Box
                  onClick={() => props.onEntryClick(entry.id)}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                  }}
                >
                  <NftListingEntry
                    _listForSaleClick={props.listForSaleClick}
                    {...entry}
                  />
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Show More Section */}
        {props.nftEntries.length > 8 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: spacing.xl,
            }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Box
                sx={{
                  px: spacing.lg,
                  py: spacing.md,
                  borderRadius: borderRadius.lg,
                  background: `linear-gradient(135deg, ${colors.neutral[800]}40 0%, ${colors.neutral[900]}60 100%)`,
                  border: `1px solid ${colors.neutral[700]}`,
                  color: colors.neutral[300],
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily,
                  fontWeight: typography.fontWeights.medium,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                  "&:hover": {
                    border: `1px solid ${colors.primary.main}60`,
                    color: colors.primary.main,
                    background: `linear-gradient(135deg, ${colors.neutral[750]}60 0%, ${colors.neutral[850]}80 100%)`,
                  },
                }}
              >
                View All NFTs
                <ArrowForward sx={{ fontSize: "16px" }} />
              </Box>
            </motion.div>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};
export default RecentNfts;
