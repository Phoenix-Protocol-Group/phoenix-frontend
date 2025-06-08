import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Button } from "../../Button/Button";
import React from "react";
import { CryptoCTAProps } from "@phoenix-protocol/types";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../Theme/styleConstants";

const CryptoCTA = ({ onClick }: CryptoCTAProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: borderRadius.xl,
          border: `1px solid ${colors.neutral[700]}`,
          p: spacing.xl,
          pb: "2rem",
          height: "26rem",
          background: `linear-gradient(145deg, ${colors.neutral[900]} 0%, ${colors.neutral[850]} 100%)`,
          backdropFilter: "blur(20px)",
          mt: spacing.xl,
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            border: `1px solid ${colors.primary.main}`,
            boxShadow: `0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px ${colors.primary.main}`,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(145deg, transparent 0%, rgba(249, 115, 22, 0.05) 50%, transparent 100%)`,
            borderRadius: borderRadius.xl,
            zIndex: 0,
          },
        }}
      >
        {/* Animated glow effect */}
        <Box
          sx={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: `radial-gradient(circle, ${colors.primary.main}1A 0%, transparent 50%)`,
            opacity: 0,
            transition: "opacity 0.3s ease",
            zIndex: 0,
            ".MuiBox-root:hover &": {
              opacity: 1,
            },
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            py: spacing.lg,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <Box
              component="img"
              src="/banklocker.png"
              sx={{
                mt: spacing.md,
                filter: "drop-shadow(0 4px 20px rgba(249, 115, 22, 0.3))",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem" },
                fontFamily: typography.fontFamily,
                fontWeight: typography.fontWeights.regular,
                lineHeight: "2.5rem",
                color: colors.neutral[50],
                textAlign: "center",
              }}
            >
              Need More
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem" },
                fontWeight: typography.fontWeights.bold,
                fontFamily: typography.fontFamily,
                lineHeight: "2.5rem",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textAlign: "center",
              }}
            >
              Crypto?
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Typography
              sx={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral[300],
                mt: spacing.sm,
                textAlign: "center",
                fontFamily: typography.fontFamily,
                fontWeight: typography.fontWeights.medium,
              }}
            >
              You can easily deposit now!
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: "100%" }}
          >
            <Button
              type="primary"
              onClick={onClick}
              sx={{
                width: "100%",
                mt: spacing.lg,
                mb: spacing.md,
                height: { xs: "48px", sm: "52px" },
                fontSize: {
                  xs: typography.fontSize.sm,
                  sm: typography.fontSize.md,
                },
                fontWeight: typography.fontWeights.semiBold,
                fontFamily: typography.fontFamily,
                textTransform: "none",
                borderRadius: borderRadius.lg,
                background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary[400]} 100%)`,
                border: `1px solid rgba(249, 115, 22, 0.3)`,
                boxShadow: `0 4px 20px rgba(249, 115, 22, 0.3), 0 2px 10px rgba(0, 0, 0, 0.1)`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary.main} 100%)`,
                  transform: "translateY(-3px)",
                  boxShadow: `0 8px 30px rgba(249, 115, 22, 0.4), 0 4px 15px rgba(249, 115, 22, 0.2)`,
                  border: `1px solid rgba(249, 115, 22, 0.5)`,
                },
                "&:active": {
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 20px rgba(249, 115, 22, 0.3), 0 2px 10px rgba(0, 0, 0, 0.1)`,
                },
                // Mobile-specific touch feedback
                "@media (max-width: 768px)": {
                  "&:active": {
                    transform: "scale(0.98)",
                    transition: "all 0.1s ease",
                  },
                },
              }}
            >
              Buy Now!
            </Button>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

export default CryptoCTA;
