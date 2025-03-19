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
        background: "var(--primary-500, #F97316)",
        padding: "1px", // This is the border witdh
        borderRadius: "12px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          background: "var(--neutral-900, #171717)",
          padding: "1rem",
          alignItems: "center",
          flexShrink: 0,
          borderRadius: "12px",
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
            width: "4rem",
            height: "4rem",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            borderRadius: "8px",
          }}
        />
        <Box>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 700,
              ml: "1rem",
              color: "var(--neutral-50, #FAFAFA)",
            }}
          >
            {name}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 400,
              ml: "1rem",
              color: "var(--neutral-300, #D4D4D4)",
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
