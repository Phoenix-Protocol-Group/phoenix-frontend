import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { GettingStartedCardProps } from "@phoenix-protocol/types";

const GettingStartedCard = (props: GettingStartedCardProps) => {
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
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          border: "1px solid #404040",
          py: { xs: 3, md: 4 },
          px: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          background: "linear-gradient(145deg, #262626 0%, #1a1a1a 100%)",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          minHeight: { xs: "180px", md: "220px" },
          "&:hover": {
            borderColor: "#F97316",
            boxShadow:
              "0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(249, 115, 22, 0.15)",
            "& .icon-container": {
              transform: "scale(1.1) rotate(5deg)",
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
        {/* Icon Container */}
        <Box
          className="icon-container"
          sx={{
            position: "relative",
            zIndex: 2,
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background:
              "linear-gradient(145deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            transition: "transform 0.3s ease",
          }}
        >
          <Box
            component="img"
            src={props.image}
            alt={`${props.name} icon`}
            sx={{
              width: "32px",
              height: "32px",
              filter: "brightness(1.2)",
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
            alignItems: "center",
            flex: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              fontWeight: 700,
              fontFamily: "Ubuntu, sans-serif",
              color: "#FAFAFA",
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            {props.name}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.875rem", md: "1rem" },
              fontWeight: 400,
              color: "#A3A3A3",
              lineHeight: 1.5,
              maxWidth: "220px",
            }}
          >
            {props.description}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default GettingStartedCard;
