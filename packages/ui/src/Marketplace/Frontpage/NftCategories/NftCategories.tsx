import { ArrowRightAlt } from "@mui/icons-material";
import { Box, Fade, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import NftCategoriesCard from "./NftCategoriesCard";

export interface NftCategoriesCardProps {
  id: string;
  _onClick?: (id: string) => void;
  image: string;
  name: string;
}

export interface NftCategoriesProps {
  entries: NftCategoriesCardProps[];
  onEntryClick: (id: string) => void;
  onViewAllClick: () => void;
}

const NftCategories = (props: NftCategoriesProps) => {
  const [ready, setReady] = React.useState<boolean>(false);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [entryLength, setEntryLength] = React.useState<number>(0);

  React.useEffect(() => {
    const handleResize = () => {
      if (isMdUp) {
        setEntryLength(5);
      } else {
        setEntryLength(6);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMdUp]);

  React.useEffect(() => {
    setReady(true);
  }, [props.entries]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: "#FFF",
            fontFamily: "Ubuntu",
            fontSize: "2rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            flex: 1,
          }}
        >
          NFTs Categories
        </Typography>
        <Box
          sx={{
            display: "flex",
            height: "2.3125rem",
            padding: "1.125rem 0.7rem 1.125rem 1rem",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "1rem",
            cursor: "pointer",
            background:
              "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
            color: "#FFF",
            textAlign: "center",
            fontSize: "0.625rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "1.25rem",
          }}
          onClick={props.onViewAllClick}
        >
          <Box mr={0.5} whiteSpace="nowrap">
            View All
          </Box>
          <ArrowRightAlt sx={{ fontSize: "16px" }} />
        </Box>
      </Box>
      <Grid container spacing={2}>
        {props.entries
          .slice(0, entryLength)
          .map((item: NftCategoriesCardProps, index: number) => (
            <Fade
              key={index}
              in={ready}
              {...(ready ? { timeout: index * 500 } : {})}
              unmountOnExit
            >
              <Grid item xs={6} md={12 / 5}>
                <NftCategoriesCard _onClick={props.onEntryClick} {...item} />
              </Grid>
            </Fade>
          ))}
      </Grid>
    </Box>
  );
};

export default NftCategories;
