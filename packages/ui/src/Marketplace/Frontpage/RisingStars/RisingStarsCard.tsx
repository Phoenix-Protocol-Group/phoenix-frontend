import { Box, Typography } from "@mui/material";
import { RisingStarCardProps } from "./RisingStars";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

const RisingStarsCard = (props: RisingStarCardProps) => {
  return (
    <Box
      onClick={() => props._onClick(props.id)}
      sx={{
        border: "1px solid #2C2C31",
        backgroundColor: "#1F2123",
        cursor: "pointer",
        borderRadius: "8px",
        overflowY: "hidden",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row"
        },
        alignItems: {
          xs: "center",
          md: "unset"
        },
        p: 2,
        "&:hover": {
          borderColor: "#E2621B",
        },
      }}
    >
      <Box sx={{
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        overflow: "hidden",
        mr: {
          xs: 0,
          md: 2
        },
        mb: {
          xs: 1,
          md: 0
        },
      }}>
        <Box
          component="img"
          sx={{
            width: "100%"
          }}
          alt={`preview image for ${props.collectionName} collection`}
          src={props.image}
        />
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <Typography sx={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#FFF",
          lineHeight: "20px"
        }}>
          {props.collectionName}
        </Typography>
        <Typography sx={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#FFF",
          opacity: 0.6,
          display: "flex",
          alignItems: "center",
          justifyContent: {
            xs: "center",
            md: "unset"
          },
          marginLeft: {
            xs: "-5px",
            md: 0
          }
        }}>
          {props.percent >= 0 ? <ArrowUpward sx={{fontSize: "16px"}} /> : <ArrowDownward sx={{fontSize: "16px"}} />}{props.percent}%
        </Typography>
      </Box>
    </Box>
  );
};

export default RisingStarsCard;
