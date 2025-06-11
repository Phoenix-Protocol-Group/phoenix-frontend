import React from "react";
import { Box, Typography } from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { motion } from "framer-motion";
import { RisingStarCardProps } from "@phoenix-protocol/types";

const RisingStarsCard = (props: RisingStarCardProps) => {
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
          p: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          gap: { xs: 1, md: 2 },
          "&:hover": {
            borderColor: "#F97316",
            boxShadow:
              "0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(249, 115, 22, 0.15)",
            "& .collection-image": {
              transform: "scale(1.1)",
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
        {/* Collection Image */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: { xs: "48px", md: "56px" },
            height: { xs: "48px", md: "56px" },
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #404040",
            transition: "border-color 0.3s ease",
            "&:hover": {
              borderColor: "#F97316",
            },
          }}
        >
          <Box
            className="collection-image"
            component="img"
            src={props.image}
            alt={`${props.collectionName} collection`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
          />
        </Box>

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            flex: 1,
          }}
        >
          {/* Collection Name */}
          <Typography
            sx={{
              fontSize: { xs: "0.875rem", md: "1rem" },
              fontWeight: 700,
              color: "#FAFAFA",
              fontFamily: "Ubuntu, sans-serif",
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {props.collectionName}
          </Typography>

          {/* Percentage Change */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            {props.percent >= 0 ? (
              <ArrowUpward
                sx={{
                  fontSize: "16px",
                  color: "#22C55E", // Green for positive
                }}
              />
            ) : (
              <ArrowDownward
                sx={{
                  fontSize: "16px",
                  color: "#EF4444", // Red for negative
                }}
              />
            )}
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: props.percent >= 0 ? "#22C55E" : "#EF4444",
                fontFamily: "Ubuntu, sans-serif",
              }}
            >
              {Math.abs(props.percent)}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default RisingStarsCard;
