"use client";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useAppStore } from "@phoenix-protocol/state";
import { HelpCenterArticle } from "@phoenix-protocol/types";
import { ArticleCard, CategoryCard, Skeleton } from "@phoenix-protocol/ui";
import { HelpCenter } from "@phoenix-protocol/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const scrollbarStyles = {
  /* Firefox */
  scrollbarWidth: "thin",
  scrollbarColor: "#E2491A #1B1B1B",

  /* Chrome, Edge, and Safari */
  "&::-webkit-scrollbar": {
    width: "4px",
  },

  "&::-webkit-scrollbar-track": {
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%);",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#E2491A",
    borderRadius: "8px",
  },
};

export default function Page() {
  const router = useRouter();
  const appStore = useAppStore();
  const [categories, setCategories] = React.useState<
    {
      name: string;
      description: string;
      thumbnail: string;
      id: string;
    }[]
  >([]);

  // Search value
  const [searchValue, setSearchValue] = useDebounce<string | undefined>(
    undefined,
    500
  );

  const [results, setResults] = useState<
    { id: string; title: any; description: any; thumbnail: string }[]
  >([]);

  const [featuredArticles, setFeaturedArticles] = useState<HelpCenterArticle[]>(
    []
  );

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = async () => {
    try {
      // Fetch categories
      const fetchCategories = await HelpCenter.getAllCategories();
      const _categories = fetchCategories.map((category) => {
        return {
          name:
            category.title!.charAt(0).toUpperCase() + category.title!.slice(1),
          description: category.articles!.length + " Articles",
          // @ts-ignore
          thumbnail: `https://phoenix-helpcenter.pockethost.io/api/files/${category.collectionId}/${category.id}/${category.thumbnail}`,
          // @ts-ignore
          id: category.id,
        };
      });
      setCategories(_categories);

      // Fetch featured articles
      const fetchFeaturedArticles = await HelpCenter.getFeaturedArticles();
      // Map correct categories
      const _featuredCategories = fetchFeaturedArticles.map((article) => {
        return {
          ...article,
          category:
            fetchCategories.find(
              // @ts-ignore
              (category) => category.id === article.category![0]
            )?.title || "",
        };
      });
      // @ts-ignore
      setFeaturedArticles(_featuredCategories as HelpCenterArticle[]);
    } catch (error) {
      console.log(error);
    } finally {
      appStore.setLoading(false);
    }
  };

  useEffect(() => {
    if (searchValue) {
      const fetchResults = async () => {
        try {
          const searchResults = await HelpCenter.searchArticles(searchValue);
          setResults(
            searchResults.map((article: any) => {
              return {
                id: article.id,
                title: article.title,
                description: article.description,
                thumbnail: `https://phoenix-helpcenter.pockethost.io/api/files/${article.collectionId}/${article.id}/${article.thumbnail}`,
              };
            })
          );
        } catch (error) {
          console.log(error);
        } finally {
          appStore.setLoading(false);
        }
      };
      fetchResults();
    } else {
      setResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <Container sx={{ mt: { xs: 8, md: 2 } }}>
      <Grid container>
        <Grid sx={{ position: "relative" }} item xs={12} md={6}>
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
          <Input
            placeholder="Search a keyword"
            onChange={(e: any) => setSearchValue(e.target.value)}
            sx={{
              width: "100%",
              mr: 2,
              mt: 2,
              borderRadius: "16px",
              border: "1px solid #2D303A",
              background: "#1D1F21",
              padding: "8px 16px",
              lineHeight: "18px",
              fontSize: "13px",
              position: "relative",
              marginBottom: "16px",
              "&:before": {
                content: "none",
              },
              "&:after": {
                content: "none",
              },
            }}
            startAdornment={
              <Box
                component="img"
                style={{ marginRight: "8px" }}
                src="/MagnifyingGlass.svg"
              />
            }
          />
          {results.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                borderRadius: "16px",
                right: 0,
                maxHeight: 300,
                overflowY: "auto",
                ...scrollbarStyles,
              }}
            >
              <List>
                {results.map((result) => (
                  <ListItem
                    onClick={() =>
                      router.push(`/help-center/articles/${result.id}`)
                    }
                    key={result.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#2D303A",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={result.thumbnail} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={result.title}
                      secondary={result.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>
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
