import {
  Box,
  Fade,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowForward, ArrowBack, ArrowRightAlt } from "@mui/icons-material";
import React from "react";
import PopularNftsCard from "./PopularNftsCard";

const tabUnselectedStyles = {
  display: "flex",
  width: "2.75rem",
  height: "2.3125rem",
  padding: "1.125rem 1.5rem",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.625rem",
  borderRadius: "1rem",
  cursor: "pointer",
  background:
    "var(--Secondary-S3, linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%))",
  color: "#FFF",
  opacity: 0.6,
  textAlign: "center",
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily: "Ubuntu",
  fontSize: "0.625rem",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "1.25rem", // 200%
  flex: 1
};

const tabSelectedStyles = {
  display: "flex",
  height: "2.25rem",
  padding: "1.125rem 1.5rem",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.625rem",
  flex: "1 0 0",
  borderRadius: "1rem",
  border: "1px solid var(--Primary-P3, #E2571C)",
  background: "rgba(226, 73, 26, 0.10)",
  color: "#FFF",
  opacity: 1,
  textAlign: "center",
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily: "Ubuntu",
  fontSize: "0.625rem",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "1.25rem", // 200%
};

const ArrowButtonStyles = {
  background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
  width: "38px",
  height: "38px",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
};

export interface NftCardProps {
  image: string;
  collectionName: string;
  nftName: string;
  price: string;
  volume: string;
  icon: string;
}

export interface FeaturedProps {
  entries: NftCardProps[];
  forwardClick?: () => void;
  backwardClick?: () => void;
  activeTime: "6h" | "1d" | "7d" | "30d";
  setActiveTime: (time: "6h" | "1d" | "7d" | "30d") => void;
  onViewAllClick: () => void;
}

const PopularNfts = (props: FeaturedProps) => {
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
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          position: "relative",
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
            width: {
              xs: "100%",
              md: "unset",
            },
          }}
        >
          Popular NFTs
        </Typography>
        <Box sx={{
          display: "flex",
          width: {
            xs: "100%",
            md: "unset"
          },
          mt: {
            xs: 2,
            md: 0
          }
        }}>
          <Box
            mr={0.5}
            sx={
              props.activeTime === "6h"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveTime("6h")}
          >
            6H
          </Box>
          <Box
            mr={0.5}
            sx={
              props.activeTime === "1d"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveTime("1d")}
          >
            1D
          </Box>
          <Box
            mr={0.5}
            sx={
              props.activeTime === "7d"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveTime("7d")}
          >
            7D
          </Box>
          <Box
            mr={2}
            sx={
              props.activeTime === "30d"
                ? { ...tabUnselectedStyles, ...tabSelectedStyles }
                : tabUnselectedStyles
            }
            onClick={() => props.setActiveTime("30d")}
          >
            30D
          </Box>
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
              mr: {
                xs: 0,
                md: 2
              }
            }}
            onClick={props.onViewAllClick}
          >
            <Box mr={0.5} whiteSpace="nowrap">
              View All
            </Box>
            <ArrowRightAlt sx={{ fontSize: "16px" }} />
          </Box>
          {props.backwardClick && props.forwardClick && (
            <Box sx={{
              display: "flex",
              position: {
                xs: "absolute",
                md: "unset"
              },
              right: 0,
              top: "4px",
            }}>
              <Box mr={1}>
                <Box sx={ArrowButtonStyles}>
                  <ArrowBack
                    sx={{
                      fontSize: "16px",
                    }}
                  />
                </Box>
              </Box>
              <Box sx={ArrowButtonStyles}>
                <ArrowForward
                  sx={{
                    fontSize: "16px",
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Grid container spacing={2}>
        {props.entries
          .slice(0, entryLength)
          .map((item: NftCardProps, index: number) => (
            <Fade
              key={index}
              in={ready}
              {...(ready ? { timeout: index * 500 } : {})}
              unmountOnExit
            >
              <Grid item xs={6} md={12 / 5}>
                <PopularNftsCard {...item} />
              </Grid>
            </Fade>
          ))}
      </Grid>
    </Box>
  );
};

export default PopularNfts;
