"use client";
import { Box, Container, Grid, Typography } from "@mui/material";
import { HelpCenterArticle } from "@phoenix-protocol/types";
import { ArticleCard, Skeleton } from "@phoenix-protocol/ui";
import { HelpCenter } from "@phoenix-protocol/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CategoryPageProps {
  readonly params: {
    readonly categoryID: string;
  };
}

export default function Page({ params }: CategoryPageProps) {
  const [articles, setArticles] = useState<HelpCenterArticle[] | undefined>(
    undefined
  );
  const [featuredArticles, setFeaturedArticles] = useState<HelpCenterArticle[]>(
    []
  );

  const [categoryName, setCategoryName] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      // Fetch articles by category
      const fetchArticles = await HelpCenter.getArticlesByCategory(
        params.categoryID
      );

      const _articles = fetchArticles.expand?.articles;

      // Split articles in featured and normal
      const featuredArticles = _articles?.filter(
        (article: HelpCenterArticle) => article.featured === true
      );

      setCategoryName(fetchArticles.title);
      setFeaturedArticles(featuredArticles as HelpCenterArticle[]);
      setArticles(_articles);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container>
      <Box>
        <Typography
          sx={{
            fontFamily: "Ubuntu",
            fontSize: "3rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "3.5rem",
            mt: 2,
          }}
        >
          {categoryName}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Ubuntu",
            fontSize: "2rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            mt: 5,
          }}
        >
          Featured {categoryName} Articles
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {featuredArticles && featuredArticles.length > 0
            ? featuredArticles?.map((article) => (
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
            : Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton.ArticleCard />
                </Grid>
              ))}
        </Grid>
        <Typography
          sx={{
            fontFamily: "Ubuntu",
            fontSize: "2rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            mt: 5,
          }}
        >
          All {categoryName} Articles
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {articles && articles.length > 0
            ? articles?.map((article) => (
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
