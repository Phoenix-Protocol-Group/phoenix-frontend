import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { motion } from "framer-motion";
import { CreateOptionCardProps } from "@phoenix-protocol/types";
import {
  colors,
  spacing,
  typography,
  borderRadius,
  cardStyles,
} from "../../../Theme/styleConstants";

const CreateOptionCard = (props: CreateOptionCardProps) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        onClick={props.onClick}
        sx={{
          ...cardStyles.base,
          p: { xs: spacing.lg, md: spacing.xl },
          borderRadius: borderRadius.xl,
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: "140px", md: "160px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            ...cardStyles.hover,
            transform: "translateY(-2px)",
            "& .arrow-icon": {
              color: colors.primary.main,
            },
            "& .background-pattern": {
              opacity: 0.6,
              transform: "scale(1.05) rotate(2deg)",
            },
          },
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, transparent 30%, rgba(249, 115, 22, 0.05) 50%, transparent 70%)`,
            opacity: 0,
            transition: "opacity 0.4s ease-in-out",
          },
          "&:hover:before": {
            opacity: 1,
            animation: "shimmer 2s infinite",
            "@keyframes shimmer": {
              "0%": { transform: "translateX(-100%)" },
              "100%": { transform: "translateX(100%)" },
            },
          },
        }}
      >
        <Grid
          container
          alignItems="center"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid item xs>
            <Box sx={{ mb: spacing.md }}>
              <Typography
                sx={{
                  fontSize: {
                    xs: typography.fontSize.xl,
                    md: typography.fontSize.xxl,
                  },
                  lineHeight: 1.3,
                  color: colors.neutral[50],
                  fontWeight: typography.fontWeights.bold,
                  fontFamily: typography.fontFamily,
                  mb: spacing.sm,
                  background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[200]} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {props.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: {
                    xs: typography.fontSize.sm,
                    md: typography.fontSize.md,
                  },
                  lineHeight: 1.5,
                  color: colors.neutral[400],
                  fontFamily: typography.fontFamily,
                  fontWeight: typography.fontWeights.medium,
                  maxWidth: "280px",
                }}
              >
                {props.description}
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs="auto"
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {/* Enhanced Arrow with Orange Accent */}
            <Box
              sx={{
                width: { xs: "48px", md: "56px" },
                height: { xs: "48px", md: "56px" },
                borderRadius: "50%",
                background: `linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.08) 100%)`,
                border: `1px solid rgba(249, 115, 22, 0.2)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
            >
              <ArrowForward
                className="arrow-icon"
                sx={{
                  fontSize: { xs: "24px", md: "28px" },
                  color: colors.neutral[300],
                  transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Bottom accent line */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.3), transparent)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
            ".MuiBox-root:hover &": {
              opacity: 1,
            },
          }}
        />
      </Box>
    </motion.div>
  );
};

export default CreateOptionCard;
