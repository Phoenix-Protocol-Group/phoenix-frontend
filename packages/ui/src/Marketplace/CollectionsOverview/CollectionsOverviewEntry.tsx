import React from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { CollectionsOverviewEntryProps } from "@phoenix-protocol/types";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

const CollectionsOverviewEntry = (props: CollectionsOverviewEntryProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Box
        onClick={() => props._onClick(props.id)}
        sx={{
          p: { xs: spacing.md, md: spacing.lg },
          mb: spacing.md,
          borderRadius: borderRadius.lg,
          background: `linear-gradient(145deg, ${colors.neutral[850]} 0%, ${colors.neutral[800]} 100%)`,
          border: `1px solid ${colors.neutral[700]}`,
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${colors.primary.main}30, transparent)`,
          },
          "&:hover": {
            border: `1px solid ${colors.primary.main}60`,
            background: `linear-gradient(145deg, ${colors.neutral[800]} 0%, ${colors.neutral[750]} 100%)`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px ${colors.primary.main}20`,
            transform: "translateY(-2px)",
          },
        }}
      >
        <Grid
          container
          alignItems="center"
          spacing={{ xs: 1, md: 2 }}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: colors.neutral[400],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.bold,
                fontFamily: typography.fontFamily,
                mr: spacing.md,
                minWidth: "24px",
                textAlign: "center",
              }}
            >
              {props._number + 1}
            </Typography>

            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.primary.main}20 0%, ${colors.primary.main}10 100%)`,
                border: `1px solid ${colors.primary.main}30`,
                overflow: "hidden",
                mr: spacing.md,
              }}
            >
              <Box
                component="img"
                src={props.previewImage}
                alt={`${props.collectionName} preview`}
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))",
                }}
              />
            </Box>

            <Typography
              sx={{
                color: colors.neutral[50],
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeights.semiBold,
                fontFamily: typography.fontFamily,
                lineHeight: 1.2,
              }}
            >
              {props.collectionName}
            </Typography>
          </Grid>

          <Grid
            item
            xs={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Typography
              sx={{
                color: colors.neutral[50],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.semiBold,
                fontFamily: typography.fontFamily,
              }}
            >
              {props.floorPrice} PHO
            </Typography>
          </Grid>

          <Grid
            item
            xs={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Typography
              sx={{
                color: colors.neutral[50],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.semiBold,
                fontFamily: typography.fontFamily,
              }}
            >
              {props.bestOffer} PHO
            </Typography>
          </Grid>

          <Grid
            item
            xs={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Typography
              sx={{
                color: colors.neutral[50],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.semiBold,
                fontFamily: typography.fontFamily,
              }}
            >
              {props.volume} PHO
            </Typography>
          </Grid>

          <Grid
            item
            xs={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Typography
              sx={{
                color: colors.neutral[50],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.semiBold,
                fontFamily: typography.fontFamily,
              }}
            >
              {props.owners}
            </Typography>
          </Grid>

          <Grid
            item
            xs={1}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Typography
              sx={{
                color: colors.neutral[50],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.semiBold,
                fontFamily: typography.fontFamily,
              }}
            >
              {props.forSalePercent}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default CollectionsOverviewEntry;
