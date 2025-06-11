import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { PopularNftCardProps } from "@phoenix-protocol/types";

const PopularNftsCard = (props: PopularNftCardProps) => {
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
          overflow: "hidden",
          cursor: "pointer",
          background: "linear-gradient(145deg, #262626 0%, #1a1a1a 100%)",
          border: "1px solid #404040",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
          "&:hover": {
            borderColor: "#F97316",
            boxShadow:
              "0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(249, 115, 22, 0.15)",
            "& .image-container": {
              transform: "scale(1.05)",
            },
            "& .gradient-overlay": {
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(249, 115, 22, 0.1) 50%, rgba(0, 0, 0, 0.8) 100%)",
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
        {/* NFT Image */}
        <Box
          sx={{
            position: "relative",
            aspectRatio: "1",
            overflow: "hidden",
          }}
        >
          <Box
            className="image-container"
            component="img"
            src={props.image}
            alt={props.nftName}
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
                "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)",
              transition: "background 0.3s ease",
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
          {/* Collection Name */}
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "#A3A3A3",
              mb: 0.5,
              fontFamily: "Ubuntu, sans-serif",
            }}
          >
            {props.collectionName}
          </Typography>

          {/* NFT Name */}
          <Typography
            sx={{
              fontSize: { xs: "0.875rem", md: "1rem" },
              fontWeight: 700,
              color: "#FAFAFA",
              mb: 2,
              fontFamily: "Ubuntu, sans-serif",
              lineHeight: 1.2,
            }}
          >
            {props.nftName}
          </Typography>

          {/* Stats */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "#A3A3A3",
                  mb: 0.5,
                  fontFamily: "Ubuntu, sans-serif",
                }}
              >
                Floor Price
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  component="img"
                  src={props.icon}
                  alt="token"
                  sx={{ width: 16, height: 16 }}
                />
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#FAFAFA",
                    fontFamily: "Ubuntu, sans-serif",
                  }}
                >
                  {props.price}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "#A3A3A3",
                  mb: 0.5,
                  fontFamily: "Ubuntu, sans-serif",
                }}
              >
                Volume
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  component="img"
                  src={props.icon}
                  alt="token"
                  sx={{ width: 16, height: 16 }}
                />
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#FAFAFA",
                    fontFamily: "Ubuntu, sans-serif",
                  }}
                >
                  {props.volume}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </motion.div>
  );
};

export default PopularNftsCard;
