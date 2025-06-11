import React from "react";
import {
  Box,
  Fade,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ArrowForward } from "@mui/icons-material";
import FeaturedCard from "./FeaturedCard";
import { FeaturedCardProps, FeaturedProps } from "@phoenix-protocol/types";

const Featured = (props: FeaturedProps) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [ready, setReady] = React.useState<boolean>(false);
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
    <Box sx={{ mb: { xs: 4, md: 6 } }}>
      {/* Modern Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 3, md: 4 },
          pb: 2,
          borderBottom: "1px solid rgba(64, 64, 64, 0.3)",
        }}
      >
        <Box>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              fontWeight: 700,
              fontFamily: "Ubuntu, sans-serif",
              background: "linear-gradient(135deg, #FAFAFA 0%, #F97316 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
            }}
          >
            Featured Collections
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.875rem", md: "1rem" },
              color: "#A3A3A3",
              fontWeight: 400,
            }}
          >
            Discover the most popular and trending NFT collections
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {props.backwardClick && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={props.backwardClick}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(145deg, #262626 0%, #1a1a1a 100%)",
                  border: "1px solid #404040",
                  color: "#FAFAFA",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)",
                    borderColor: "#F97316",
                    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
                  },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </motion.div>
          )}
          {props.forwardClick && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={props.forwardClick}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(145deg, #262626 0%, #1a1a1a 100%)",
                  border: "1px solid #404040",
                  color: "#FAFAFA",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)",
                    borderColor: "#F97316",
                    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
                  },
                }}
              >
                <ArrowForward sx={{ fontSize: 18 }} />
              </IconButton>
            </motion.div>
          )}
        </Box>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {props.entries
          .slice(0, entryLength)
          .map((item: FeaturedCardProps, index: number) => (
            <Grid key={index} item xs={6} md={12 / 5}>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <FeaturedCard _onClick={props.onEntryClick} {...item} />
              </motion.div>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Featured;
