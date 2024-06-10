import { Box, Grid, Typography } from "@mui/material";
import { FeaturedCardProps } from "./Featured";

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
          borderColor: "#E2621B",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
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
      </Box>
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

export default FeaturedCard;
