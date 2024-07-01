import { Box, Typography } from "@mui/material";
import { NftCategoriesCardProps } from "./NftCategories";

const NftCategoriesCard = (props: NftCategoriesCardProps) => {
  return (
    <Box
      onClick={() => props._onClick(props.id)}
      sx={{
        border: "1px solid #2C2C31",
        borderRadius: "12px",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)",
        minHeight: {
          xs: "160px",
          md: "230px",
          lg: "280px"
        }
      }}
    >
      <Box
        component="img"
        sx={{
          maxWidth: "100%",
        }}
        alt="nft category image"
        src={props.image}
      />
      <Typography sx={{
        p: 3,
        color: "#FFF",
        fontSize: "14px",
        fontWeight: 700
      }}>
        {props.name}
      </Typography>
    </Box>
  );
};

export default NftCategoriesCard;
