"use client";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useAppStore } from "@phoenix-protocol/state";
import { HelpCenterArticle } from "@phoenix-protocol/types";
import { ArticleCard, Skeleton } from "@phoenix-protocol/ui";
import { HelpCenter } from "@phoenix-protocol/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

interface CategoryPageProps {
  readonly params: Promise<{
    readonly categoryID: string;
  }>;
}

export default function Page(props: CategoryPageProps) {
  const params = use(props.params);
  const [articles, setArticles] = useState<HelpCenterArticle[] | undefined>(
    undefined
  );
  const [featuredArticles, setFeaturedArticles] = useState<HelpCenterArticle[]>(
    []
  );

  const [categoryName, setCategoryName] = useState<string>("");

  const router = useRouter();
  const appStore = useAppStore();

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = async () => {
    try {
      // Fetch articles by category
      const fetchArticles = await HelpCenter.getArticlesByCategory(
        params.categoryID
      );

      // @ts-ignore
      const _articles = fetchArticles.expand?.articles;

      // Split articles in featured and normal
      const featuredArticles = _articles?.filter(
        (article: HelpCenterArticle) => article.featured === true
      );

      setCategoryName(fetchArticles.title!);
      setFeaturedArticles(featuredArticles as HelpCenterArticle[]);
      setArticles(_articles);
    } catch (error) {
      console.log(error);
    } finally {
      appStore.setLoading(false);
    }
  };
  return (
    <Container sx={{ mt: { xs: 8, md: 2 } }}>
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
