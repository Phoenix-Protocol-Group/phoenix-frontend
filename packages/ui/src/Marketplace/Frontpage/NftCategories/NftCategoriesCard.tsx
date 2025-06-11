import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { NftCategoriesCardProps } from "@phoenix-protocol/types";

const NftCategoriesCard = (props: NftCategoriesCardProps) => {
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
        onClick={() => props._onClick(props.id)}
        sx={{
          position: "relative",
          borderRadius: "16px",
          cursor: "pointer",
          background: "linear-gradient(145deg, #262626 0%, #1a1a1a 100%)",
          border: "1px solid #404040",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
          overflow: "hidden",
          minHeight: {
            xs: "160px",
            md: "230px",
            lg: "280px",
          },
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            borderColor: "#F97316",
            boxShadow:
              "0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(249, 115, 22, 0.15)",
            "& .category-image": {
              transform: "scale(1.1)",
            },
            "& .gradient-overlay": {
              opacity: 0.8,
            },
          },
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(45deg, transparent 30%, rgba(249, 115, 22, 0.03) 50%, transparent 70%)",
            opacity: 0,
            transition: "opacity 0.3s ease",
            zIndex: 1,
          },
          "&:hover:before": {
            opacity: 1,
          },
        }}
      >
        {/* Image Container */}
        <Box
          sx={{
            position: "relative",
            flex: 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            className="category-image"
            component="img"
            src={props.image}
            alt={`${props.name} category`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
          />

          {/* Gradient Overlay */}
          <Box
            className="gradient-overlay"
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
              opacity: 0.6,
              transition: "opacity 0.3s ease",
            }}
          />
        </Box>

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            p: { xs: 2, md: 3 },
          }}
        >
          <Typography
            sx={{
              color: "#FAFAFA",
              fontSize: { xs: "0.875rem", md: "1rem" },
              fontWeight: 700,
              fontFamily: "Ubuntu, sans-serif",
              lineHeight: 1.2,
            }}
          >
            {props.name}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default NftCategoriesCard;
