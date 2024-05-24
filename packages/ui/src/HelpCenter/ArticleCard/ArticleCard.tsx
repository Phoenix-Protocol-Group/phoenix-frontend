import React from "react";
import { HelpCenterArticle } from "@phoenix-protocol/types";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

const ArticleCard = ({ article }: { article: HelpCenterArticle }) => {
  const {
    id,
    category,
    collectionId,
    collectionName,
    content,
    created,
    description,
    thumbnail,
    title,
    updated,
  } = article;

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
          background: "rgba(226, 73, 26, 0.10)",
        }}
      >
        <Typography
          sx={{
            color: "var(--Secondary-S2, #FFF)",
            fontSize: "0.6875rem",
            textTransform: "uppercase",
            fontWeight: 700,
            lineHeight: "1rem",
            letterSpacing: "0.055rem",
          }}
        >
          {category}
        </Typography>
      </Box>
      <CardMedia
        component="img"
        width="440px"
        image={`https://phoenix-helpcenter.pockethost.io/api/files/${collectionId}/${id}/${thumbnail}`}
        alt="Article image"
        sx={{ bgcolor: "#2E2E2E" }}
      />
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
          {title}
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
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export { ArticleCard };
