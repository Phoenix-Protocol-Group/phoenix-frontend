import React, { useState } from "react";
import { Box, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { colors, typography, spacing, borderRadius } from "../Theme/styleConstants";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

interface CarouselItem {
  title: string;
  content: string;
  image: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const CarouselComponent = ({ items }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  };

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Box sx={{ overflow: "hidden", borderRadius: borderRadius.md }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Box
              sx={{
                borderRadius: borderRadius.lg,
                background: colors.neutral[800],
                border: `1px solid ${colors.neutral[700]}`,
                padding: { xs: spacing.md, md: spacing.lg },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: { xs: "250px", md: "300px" },
              }}
            >
              {/* If the image source exists, use it, otherwise display a placeholder */}
              {items[currentIndex].image ? (
                <Box
                  component="img"
                  src={items[currentIndex].image || "/placeholder-wallet.svg"}
                  alt={items[currentIndex].title}
                  sx={{
                    width: { xs: "80px", md: "120px" },
                    height: { xs: "80px", md: "120px" },
                    marginBottom: { xs: spacing.sm, md: spacing.md },
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                  }}
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = "/placeholder-wallet.svg";
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: { xs: "80px", md: "120px" },
                    height: { xs: "80px", md: "120px" },
                    marginBottom: { xs: spacing.sm, md: spacing.md },
                    background: colors.neutral[700],
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: colors.neutral[300], fontSize: { xs: 30, md: 40 } }}>
                    ?
                  </Typography>
                </Box>
              )}
              <Typography
                sx={{
                  fontSize: { xs: typography.fontSize.md, md: typography.fontSize.lg },
                  fontWeight: typography.fontWeights.bold,
                  color: colors.neutral[50],
                  mb: { xs: spacing.xs, md: spacing.sm },
                }}
              >
                {items[currentIndex].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: typography.fontSize.sm, md: typography.fontSize.md },
                  color: colors.neutral[300],
                  maxWidth: "90%",
                  lineHeight: 1.4,
                }}
              >
                {items[currentIndex].content}
              </Typography>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Navigation dots */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: { xs: spacing.sm, md: spacing.md },
          gap: { xs: spacing.xs, md: spacing.xs },
        }}
      >
        {items.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: { xs: 8, md: 10 },
              height: { xs: 8, md: 10 },
              borderRadius: "50%",
              backgroundColor: index === currentIndex ? colors.primary.main : colors.neutral[700],
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: index === currentIndex ? colors.primary.main : colors.neutral[600],
              },
            }}
          />
        ))}
      </Box>

      {/* Navigation arrows - hide on mobile for cleaner look */}
      {!isMobile && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: "-20px",
              transform: "translateY(-50%)",
              width: 40,
              height: 40,
              backgroundColor: colors.neutral[800],
              border: `1px solid ${colors.neutral[700]}`,
              color: colors.neutral[300],
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: colors.neutral[700],
              }
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: "-20px",
              transform: "translateY(-50%)",
              width: 40,
              height: 40,
              backgroundColor: colors.neutral[800],
              border: `1px solid ${colors.neutral[700]}`,
              color: colors.neutral[300],
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: colors.neutral[700],
              }
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default CarouselComponent;
