import { Box, Typography, Skeleton } from "@mui/material";
import React from "react";
import Colors from "../../Theme/colors";

const CategoryCard = () => {
  return (
    <Box
      style={{
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
        }}
      >
        <Skeleton variant="rounded" width={32} height={32} />
        <Box>
          <Typography
            sx={{ fontSize: "1.125rem", fontWeight: 700, ml: "1rem" }}
          >
            <Skeleton variant="text" sx={{ height: "1.125rem", width: "8rem"}} />
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 400,
              ml: "1rem",
              color: "#BFBFBF",
            }}
          >
            <Skeleton variant="text" />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryCard;
