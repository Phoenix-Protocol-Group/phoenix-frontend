import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { motion } from "framer-motion";
import { display } from "@mui/system";

interface CarouselItem {
  image: string;
  text: string;
  title: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

export const Carousel = ({ items }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          opacity: 0.5,
        }}
      >
        <ArrowBackIos />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={items[currentIndex].image}
            alt="carousel item"
            sx={{ width: { md: "186px", xs: "90px" }, borderRadius: "8px" }}
          />
          <Typography
            sx={{
              fontSize: 14,
              opacity: 0.8,
              marginTop: "1rem",
              fontWeight: 600,
              color: "var(--neutral-50, #FAFAFA)",
            }}
          >
            {items[currentIndex].title}
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              opacity: 0.4,
              marginBottom: "1rem",
              textAlign: "center",
              color: "var(--neutral-300, #D4D4D4)",
            }}
          >
            {items[currentIndex].text}
          </Typography>
        </motion.div>
      </Box>
      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          opacity: 0.5,
        }}
      >
        <ArrowForwardIos />
      </IconButton>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {items.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor:
                currentIndex === index
                  ? "#E2621B"
                  : "var(--neutral-700, #404040)",
              margin: "0 4px",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
