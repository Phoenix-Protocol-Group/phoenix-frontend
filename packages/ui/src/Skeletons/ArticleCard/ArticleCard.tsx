import React from "react";
import { HelpCenterArticle } from "@phoenix-protocol/types";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";

const ArticleCard = () => {
  return (
    <Card
      sx={{
        borderRadius: "0.75rem",
        border: "1px solid #525252",
        background:
          "var(--card-bg, linear-gradient(180deg, #292B2C 0%, #1F2123 100%))",
        "&:hover": {
          border: "1px solid #E2571E",
        },
        cursor: "pointer",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "5.3125rem",
          height: "1.5rem",
          padding: "1.125rem 1.5rem",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.625rem",
          position: "absolute",
          left: "1rem",
          top: "1rem",
          borderRadius: "1rem",
          border: "1px solid var(--Primary-P3, #E2571C)",
          background: "#3D3D3D",
        }}
      />
      <Skeleton variant="rectangular" width={400} height={400} />
      <CardContent>
        <Typography
          gutterBottom
          component="div"
          sx={{
            color: "#FFF",
            fontFamily: "Ubuntu",
            fontSize: "1.125rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          <Skeleton variant="text" />
        </Typography>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            color: "var(--Secondary-S2-2, #BDBEBE)",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "Ubuntu",
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "1.5rem",
          }}
        >
          <Skeleton variant="text" />
        </Typography>
      </CardContent>
    </Card>
  );
};

export { ArticleCard };
