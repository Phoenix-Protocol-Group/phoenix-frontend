"use client";

import { Box, Container, Typography } from "@mui/material";
import { HelpCenterArticle } from "@phoenix-protocol/types";
import { HelpCenter } from "@phoenix-protocol/utils";
import { useEffect, useState, use } from "react";

interface ArticlePageProps {
  readonly params: Promise<{
    readonly articleID: string;
  }>;
}

export default function Page(props: ArticlePageProps) {
  const params = use(props.params);
  const [article, setArticle] = useState<HelpCenterArticle | undefined>(
    undefined
  );

  const init = async () => {
    const article = await HelpCenter.getArticleById(params.articleID);
    // @ts-ignore
    setArticle(article as HelpCenterArticle);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container sx={{ mt: { xs: 8, md: 2 }, maxWidth: "68rem" }}>
      {article && (
        <>
          <Box>
            <Typography
              sx={{
                fontFamily: "Ubuntu",
                fontSize: "3rem",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "3.5rem",
              }}
            >
              {article.title}
            </Typography>
            <Typography
              sx={{
                color: "#BDBEBE",
                fontFamily: "Ubuntu",
                fontSize: "0.875rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "1.5rem",
              }}
            >
              Last updated: {new Date(article.updated).toLocaleDateString()}
            </Typography>
          </Box>
          <style>
            {`
          .innerHtml img {
            max-width: 100%;
            height: auto;
          }
          .innerHtml {
            color: var(--Secondary-S2-2, #BDBEBE);
/* Paragraph/P1 */
font-family: Ubuntu;
font-size: 1rem;
font-style: normal;
font-weight: 400;
line-height: 140%;
          }
        `}
          </style>
          <div
            className="innerHtml"
            style={{ maxWidth: "100%" }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </>
      )}
    </Container>
  );
}
