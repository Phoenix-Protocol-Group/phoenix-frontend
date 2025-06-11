import React from "react";
import { ArrowRightAlt, Home, Star, Start } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import GettingStartedCard from "./GettingStartedCard";
import {
  GettingStartedCardProps,
  GettingStartedProps,
} from "@phoenix-protocol/types";
import { colors, spacing, typography } from "../../../Theme/styleConstants";

const GettingStarted = (props: GettingStartedProps) => {
  return (
    <Box sx={{ mb: { xs: 4, md: 6 } }}>
      {/* Modern Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: { xs: 3, md: 4 },
          pb: 2,
          borderBottom: "1px solid rgba(64, 64, 64, 0.3)",
          gap: { xs: 2, sm: 0 },
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
            <Home
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
              Getting Started
            </Typography>
            <Typography
              sx={{
                color: colors.neutral[400],
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily,
                fontWeight: typography.fontWeights.medium,
              }}
            >
              Your journey into the NFT marketplace begins here
            </Typography>
          </Box>
        </Box>
        {/* View All Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Box
            sx={{
              display: "flex",
              height: "36px",
              padding: "8px 16px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
              cursor: "pointer",
              background: "linear-gradient(145deg, #262626 0%, #1a1a1a 100%)",
              border: "1px solid #404040",
              color: "#FAFAFA",
              fontSize: "0.75rem",
              fontWeight: 600,
              fontFamily: "Ubuntu, sans-serif",
              transition: "all 0.3s ease",
              gap: 1,
              "&:hover": {
                background:
                  "linear-gradient(145deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)",
                borderColor: "#F97316",
                color: "#F97316",
                boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
              },
            }}
            onClick={props.onViewAllClick}
          >
            View All
            <ArrowRightAlt sx={{ fontSize: "16px" }} />
          </Box>
        </motion.div>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {props.entries.map((item: GettingStartedCardProps, index: number) => (
          <Grid key={index} item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <GettingStartedCard {...item} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GettingStarted;
