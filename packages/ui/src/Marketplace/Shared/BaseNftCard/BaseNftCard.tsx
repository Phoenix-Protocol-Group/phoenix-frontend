import React from "react";
import { Box, Grid, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";

export interface BaseNftCardProps {
  id: string;
  _onClick?: (id: string) => void;
  image: string;
  collectionName: string;
  nftName: string;
  price?: string;
  volume?: string;
  icon?: string;
  // Optional display options
  showVolume?: boolean;
  showTrendingBadge?: boolean;
  // Alternative bottom content
  bottomContent?: React.ReactNode;
  // Custom styling
  aspectRatio?: string;
  size?: "small" | "medium" | "large";
}

const BaseNftCard = (props: BaseNftCardProps) => {
  const {
    id,
    _onClick,
    image,
    collectionName,
    nftName,
    price,
    volume,
    icon,
    showVolume = true,
    showTrendingBadge = false,
    bottomContent,
    aspectRatio = "1",
    size = "medium",
  } = props;

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          padding: { xs: 1.5, md: 2 },
          fontSize: {
            collection: "0.65rem",
            nftName: { xs: "0.75rem", md: "0.875rem" },
            label: "0.65rem",
            value: "0.75rem",
          },
        };
      case "large":
        return {
          padding: { xs: 3, md: 4 },
          fontSize: {
            collection: "0.875rem",
            nftName: { xs: "1rem", md: "1.25rem" },
            label: "0.875rem",
            value: "1rem",
          },
        };
      default: // medium
        return {
          padding: { xs: 2, md: 3 },
          fontSize: {
            collection: "0.75rem",
            nftName: { xs: "0.875rem", md: "1rem" },
            label: "0.75rem",
            value: "0.875rem",
          },
        };
    }
  };

  const sizeStyles = getSizeStyles();

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
        onClick={() => _onClick?.(id)}
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
            aspectRatio: aspectRatio,
            overflow: "hidden",
          }}
        >
          <Box
            className="image-container"
            component="img"
            src={image}
            alt={nftName}
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

          {/* Trending Badge */}
          {showTrendingBadge && (
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
          )}
        </Box>

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            p: sizeStyles.padding,
          }}
        >
          {/* Collection Name */}
          <Typography
            sx={{
              fontSize: sizeStyles.fontSize.collection,
              fontWeight: 500,
              color: "#A3A3A3",
              mb: 0.5,
              fontFamily: "Ubuntu, sans-serif",
            }}
          >
            {collectionName}
          </Typography>

          {/* NFT Name */}
          <Typography
            sx={{
              fontSize: sizeStyles.fontSize.nftName,
              fontWeight: 700,
              color: "#FAFAFA",
              mb: 2,
              fontFamily: "Ubuntu, sans-serif",
              lineHeight: 1.2,
            }}
          >
            {nftName}
          </Typography>

          {/* Custom bottom content or default stats */}
          {bottomContent || (
            <Grid container spacing={2}>
              <Grid item xs={showVolume ? 6 : 12}>
                <Typography
                  sx={{
                    fontSize: sizeStyles.fontSize.label,
                    color: "#A3A3A3",
                    mb: 0.5,
                    fontFamily: "Ubuntu, sans-serif",
                  }}
                >
                  Floor Price
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {icon && (
                    <Box
                      component="img"
                      src={icon}
                      alt="token"
                      sx={{ width: 16, height: 16 }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontSize: sizeStyles.fontSize.value,
                      fontWeight: 600,
                      color: "#FAFAFA",
                      fontFamily: "Ubuntu, sans-serif",
                    }}
                  >
                    {price}
                  </Typography>
                </Box>
              </Grid>

              {showVolume && volume && (
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      fontSize: sizeStyles.fontSize.label,
                      color: "#A3A3A3",
                      mb: 0.5,
                      fontFamily: "Ubuntu, sans-serif",
                    }}
                  >
                    Volume
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {icon && (
                      <Box
                        component="img"
                        src={icon}
                        alt="token"
                        sx={{ width: 16, height: 16 }}
                      />
                    )}
                    <Typography
                      sx={{
                        fontSize: sizeStyles.fontSize.value,
                        fontWeight: 600,
                        color: "#FAFAFA",
                        fontFamily: "Ubuntu, sans-serif",
                      }}
                    >
                      {volume}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default BaseNftCard;
