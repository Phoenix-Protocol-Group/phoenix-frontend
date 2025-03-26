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
        border: "1px solid var(--neutral-700, #404040)",
        background: "var(--neutral-900, #171717)",
        "&:hover": {
          border: "1px solid var(--primary-500, #F97316)",
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
          border: "1px solid var(--primary-500, #F97316)",
          background: "rgba(226, 73, 26, 0.10)",
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
          border: "1px solid var(--primary-500, #F97316)",
          background: "rgba(226, 73, 26, 0.10)",
        }}
      >
        <Typography
          sx={{
            color: "var(--neutral-50, #FAFAFA)",
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
        sx={{ bgcolor: "var(--neutral-800, #262626)" }}
      />
      <CardContent>
        <Typography
          gutterBottom
          component="div"
          sx={{
            color: "var(--neutral-50, #FAFAFA)",
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
            color: "var(--neutral-300, #D4D4D4)",
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
