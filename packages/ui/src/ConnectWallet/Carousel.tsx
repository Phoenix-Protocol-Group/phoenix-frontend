import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
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
                padding: spacing.lg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: "300px",
              }}
            >
              {/* If the image source exists, use it, otherwise display a placeholder */}
              {items[currentIndex].image ? (
                <Box
                  component="img"
                  src={items[currentIndex].image || "/placeholder-wallet.svg"}
                  alt={items[currentIndex].title}
                  sx={{
                    width: "120px",
                    height: "120px",
                    marginBottom: spacing.md,
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
                    width: "120px",
                    height: "120px",
                    marginBottom: spacing.md,
                    background: colors.neutral[700],
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: colors.neutral[300], fontSize: 40 }}>
                    ?
                  </Typography>
                </Box>
              )}
              <Typography
                sx={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeights.bold,
                  color: colors.neutral[50],
                  mb: spacing.sm,
                }}
              >
                {items[currentIndex].title}
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.fontSize.md,
                  color: colors.neutral[300],
                  maxWidth: "90%",
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
          mt: spacing.md,
          gap: spacing.xs,
        }}
      >
        {items.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: 10,
              height: 10,
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

      {/* Navigation arrows */}
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
    </Box>
  );
};

export default CarouselComponent;
