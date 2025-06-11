import React from "react";
import { Box, Grid, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { FeaturedCardProps } from "@phoenix-protocol/types";

const FeaturedCard = ({
  id,
  _onClick,
  image,
  name,
  price,
  volume,
  icon,
}: FeaturedCardProps) => {
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
        onClick={() => _onClick(id)}
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
            src={image}
            alt={name}
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
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 2, md: 3 },
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              fontWeight: 700,
              color: "#FAFAFA",
              fontFamily: "Ubuntu, sans-serif",
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            {name}
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "#A3A3A3",
                  fontWeight: 500,
                  mb: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Floor Price
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  component="img"
                  src={icon}
                  alt="asset icon"
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    fontWeight: 600,
                    color: "#FAFAFA",
                  }}
                >
                  {price}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "#A3A3A3",
                  fontWeight: 500,
                  mb: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Volume
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  component="img"
                  src={icon}
                  alt="asset icon"
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    fontWeight: 600,
                    color: "#F97316",
                  }}
                >
                  {volume}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Trending Badge (optional) */}
        <Chip
          label="Trending"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 3,
            backgroundColor: "rgba(249, 115, 22, 0.9)",
            color: "#FAFAFA",
            fontWeight: 600,
            fontSize: "0.75rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(249, 115, 22, 0.3)",
          }}
        />
      </Box>
    </motion.div>
  );
};
export default FeaturedCard;
