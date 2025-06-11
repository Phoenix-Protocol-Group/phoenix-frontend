import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import { CreateOptionCard } from "../Shared";
import { CreateSomethingProps } from "@phoenix-protocol/types";
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from "../../Theme/styleConstants";

const CreateSomething = (props: CreateSomethingProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, md: 6 },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 1, width: "100%" }}
      >
        <Grid
          container
          spacing={{ xs: 3, md: 4 }}
          sx={{
            width: "100%",
          }}
        >
          {/* Enhanced Header Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: "center",
                mb: { xs: 4, md: 6 },
                position: "relative",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                    fontWeight: typography.fontWeights.bold,
                    lineHeight: 1.1,
                    mb: spacing.md,
                    background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[200]} 40%, ${colors.primary.main} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: typography.fontFamily,
                    position: "relative",
                  }}
                >
                  {props.title}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: typography.fontSize.lg,
                      md: typography.fontSize.xl,
                    },
                    lineHeight: 1.6,
                    color: colors.neutral[400],
                    maxWidth: "600px",
                    margin: "0 auto",
                    fontFamily: typography.fontFamily,
                    fontWeight: typography.fontWeights.medium,
                  }}
                >
                  {props.subTitle}
                </Typography>
              </motion.div>

              {/* Subtle divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Box
                  sx={{
                    width: "80px",
                    height: "2px",
                    background: `linear-gradient(90deg, transparent, ${colors.primary.main}, transparent)`,
                    margin: `${spacing.lg} auto 0`,
                    borderRadius: "2px",
                  }}
                />
              </motion.div>
            </Box>
          </Grid>

          {/* Enhanced Options Grid */}
          <Grid item xs={12}>
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{
                    scale: 1.02,
                    y: -8,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CreateOptionCard
                    title={props.title1}
                    description={props.description1}
                    onClick={props.option1Click}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  whileHover={{
                    scale: 1.02,
                    y: -8,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CreateOptionCard
                    title={props.title2}
                    description={props.description2}
                    onClick={props.option2Click}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Grid>

          {/* Optional Call-to-Action Footer */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  mt: { xs: 4, md: 6 },
                  pt: spacing.lg,
                  borderTop: `1px solid rgba(64, 64, 64, 0.3)`,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[500],
                    fontFamily: typography.fontFamily,
                    fontWeight: typography.fontWeights.medium,
                  }}
                >
                  Choose your path to start creating amazing NFTs
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default CreateSomething;
