"use client";
import { Box, Container, Grid, Typography } from "@mui/material";
import { HelpCenterArticle } from "@phoenix-protocol/types";
import { ArticleCard, CategoryCard, Skeleton } from "@phoenix-protocol/ui";
import { HelpCenter } from "@phoenix-protocol/utils";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<
    {
      name: string;
      description: string;
      thumbnail: string;
      id: string;
    }[]
  >([]);

  const [featuredArticles, setFeaturedArticles] = React.useState<
    HelpCenterArticle[]
  >([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      // Fetch categories
      const fetchCategories = await HelpCenter.getAllCategories();
      const _categories = fetchCategories.map((category) => {
        return {
          name:
            category.title.charAt(0).toUpperCase() + category.title.slice(1),
          description: category.articles.length + " Articles",
          thumbnail: `https://phoenix-helpcenter.pockethost.io/api/files/${category.collectionId}/${category.id}/${category.thumbnail}`,
          id: category.id,
        };
      });
      setCategories(_categories);

      // Fetch featured articles
      const fetchFeaturedArticles = await HelpCenter.getFeaturedArticles();
      // Map correct categories
      const _featuredCategories = fetchFeaturedArticles.items.map((article) => {
        return {
          ...article,
          category:
            fetchCategories.find(
              (category) => category.id === article.category[0]
            )?.title || "",
        };
      });
      // @ts-ignore
      setFeaturedArticles(_featuredCategories as HelpCenterArticle[]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container sx={{ mt: "3.5rem" }}>
      <Typography
        sx={{
          fontFamily: "Ubuntu",
          fontSize: "3rem",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "3.5rem",
        }}
      >
        Hello, how can we help?
      </Typography>
      <Box sx={{ mt: 7 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: "Ubuntu",
              fontSize: "2rem",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Popular Categories
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {categories.length > 0
            ? categories.map((category) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={category.name}
                  onClick={() =>
                    router.push(`/help-center/category/${category.id}`)
                  }
                >
                  <CategoryCard category={category} />
                </Grid>
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton.CategoryCard />
                </Grid>
              ))}
        </Grid>
      </Box>
      <Box sx={{ mt: 7 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: "Ubuntu",
              fontSize: "2rem",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            Featured Articles
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {featuredArticles.length > 0
            ? featuredArticles.map((article) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={article.id}
                  onClick={() =>
                    router.push(`/help-center/articles/${article.id}`)
                  }
                >
                  <ArticleCard article={article} />
                </Grid>
              ))
            : Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton.ArticleCard />
                </Grid>
              ))}
        </Grid>
      </Box>
    </Container>
  );
}
