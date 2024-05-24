import { Box, Typography } from "@mui/material";
import React from "react";
import Colors from "../../Theme/colors";

interface CategoryCardProps {
  category: {
    name: string;
    description: string;
    thumbnail: string;
  };
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { name, description, thumbnail } = category;
  return (
    <Box
      sx={{
        display: "inline-block",
        background: "linear-gradient(180deg, #E2391B 0%, #E29E1B 100%)",
        padding: "1px", // This is the border witdh
        borderRadius: "16px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          background: Colors.background,
          padding: "1.125rem",
          alignItems: "center",
          flexShrink: 0,
          borderRadius: "16px",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            cursor: "pointer",
            opacity: 0.9,
          },
        }}
      >
        <Box
          component="img"
          src={thumbnail}
          sx={{
            display: "flex",
            width: "5rem",
            height: "5rem",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            borderRadius: "8px",
          }}
        />
        <Box>
          <Typography
            sx={{ fontSize: "1.125rem", fontWeight: 700, ml: "1rem" }}
          >
            {name}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 400,
              ml: "1rem",
              color: "#BFBFBF",
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryCard;
