import {
  Box,
  Fade,
  Grid,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ArrowForward } from "@mui/icons-material";
import React from "react";

export interface FeaturedCardProps {
  image: string;
  name: string;
  price: string;
  volume: string;
  icon: string;
}

export interface FeaturedProps {
  items: FeaturedCardProps[];
  forwardClick?: () => void;
  backwardClick?: () => void;
}

const FeaturedCard = ({
  image,
  name,
  price,
  volume,
  icon,
}: FeaturedCardProps) => {
  return (
    <Box
      sx={{
        border: "1px solid #2C2C31",
        backgroundColor: "#1F2123",
        cursor: "pointer",
        borderRadius: "12px",
        overflowY: "hidden",
        "&:hover": {
          borderColor: "#E2621B"
        }
      }}
    >
      <Box
        component="img"
        sx={{
          maxWidth: "100%",
        }}
        alt="nft preview image"
        src={image}
      />
      <Grid
        container
        sx={{
          p: 2,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)",
        }}
      >
        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              lineHeight: "16px",
              marginBottom: "8px",
            }}
          >
            {name}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            sx={{
              fontSize: "11px",
              lineHeight: "16px",
              color: "#BDBEBE",
            }}
          >
            Floor Price
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              sx={{
                maxWidth: "16px",
                marginRight: "4px",
              }}
              alt="asset icon"
              src={icon}
            />
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "24px",
                fontWeight: 400,
              }}
            >
              {price}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography
            sx={{
              fontSize: "11px",
              lineHeight: "16px",
              color: "#BDBEBE",
            }}
          >
            Volume
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              sx={{
                maxWidth: "16px",
                marginRight: "4px",
              }}
              alt="asset icon"
              src={icon}
            />
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "24px",
                fontWeight: 400,
              }}
            >
              {volume}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const Featured = ({ items, backwardClick, forwardClick }: FeaturedProps) => {
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
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const [entryLength, setEntryLength] = React.useState<number>(0);

  React.useEffect(() => {
    const handleResize = () => {
      if (isMdUp) {
        if (isLgUp) {
          setEntryLength(5);
        } else {
          setEntryLength(4);
        }
      } else {
        setEntryLength(2);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLgUp]);

  React.useEffect(() => {
    setReady(true);
  }, [items]);

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
        {backwardClick && (
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
        {forwardClick && (
          <Box sx={ArrowButtonStyles}>
            <ArrowForward
              sx={{
                fontSize: "16px",
              }}
            />
          </Box>
        )}
      </Box>
      <Grid container spacing={1}>
        {items
          .slice(0, entryLength)
          .map((item: FeaturedCardProps, index: number) => (
            <Fade
              key={index}
              in={ready}
              {...(ready ? { timeout: index * 500 } : {})}
              unmountOnExit
            >
              <Grid item xs={6} md={3} lg={12 / 5}>
                <FeaturedCard {...item} />
              </Grid>
            </Fade>
          ))}
      </Grid>
    </Box>
  );
};

export default Featured;
