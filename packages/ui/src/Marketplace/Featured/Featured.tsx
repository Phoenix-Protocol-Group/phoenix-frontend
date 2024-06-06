import {
  Box,
  Fade,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ArrowForward } from "@mui/icons-material";
import React from "react";
import FeaturedCard from "./FeaturedCard";

export interface FeaturedCardProps {
  image: string;
  name: string;
  price: string;
  volume: string;
  icon: string;
}

export interface FeaturedProps {
  entries: FeaturedCardProps[];
  forwardClick?: () => void;
  backwardClick?: () => void;
}

const Featured = (props: FeaturedProps) => {
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
          Featured
        </Typography>
        {props.backwardClick && (
          <Box mr={1}>
            <Box sx={ArrowButtonStyles}>
              <ArrowBackIcon
                sx={{
                  fontSize: "16px",
                }}
              />
            </Box>
          </Box>
        )}
        {props.forwardClick && (
          <Box sx={ArrowButtonStyles}>
            <ArrowForward
              sx={{
                fontSize: "16px",
              }}
            />
          </Box>
        )}
      </Box>
      <Grid container spacing={2}>
        {props.entries
          .slice(0, entryLength)
          .map((item: FeaturedCardProps, index: number) => (
            <Fade
              key={index}
              in={ready}
              {...(ready ? { timeout: index * 500 } : {})}
              unmountOnExit
            >
              <Grid item xs={6} md={12 / 5}>
                <FeaturedCard {...item} />
              </Grid>
            </Fade>
          ))}
      </Grid>
    </Box>
  );
};

export default Featured;
