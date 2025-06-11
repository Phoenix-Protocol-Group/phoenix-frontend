import React from "react";
import { ArrowRightAlt, Apps } from "@mui/icons-material";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import NftCategoriesCard from "./NftCategoriesCard";
import {
  NftCategoriesCardProps,
  NftCategoriesProps,
} from "@phoenix-protocol/types";

import { colors, spacing, typography } from "../../../Theme/styleConstants";

const NftCategories = (props: NftCategoriesProps) => {
  const [ready, setReady] = React.useState<boolean>(false);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [entryLength, setEntryLength] = React.useState<number>(0);

  React.useEffect(() => {
    const handleResize = () => {
      if (isMdUp) {
        setEntryLength(5);
      } else {
        setEntryLength(6);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMdUp]);

  React.useEffect(() => {
    setReady(true);
  }, [props.entries]);

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
              <Apps
                sx={{
                  fontSize: "24px",
                  color: "#F97316",
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
                Recent Collections
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

      {/* Categories Grid */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {props.entries
          .slice(0, entryLength)
          .map((item: NftCategoriesCardProps, index: number) => (
            <Grid key={index} item xs={6} md={12 / 5}>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <NftCategoriesCard _onClick={props.onEntryClick} {...item} />
              </motion.div>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default NftCategories;
