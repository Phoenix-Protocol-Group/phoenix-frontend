import { Box, Grid, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

export interface CreateOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const CreateOptionCard = (props: CreateOptionCardProps) => {
  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
        p: 4,
        borderRadius: "16px",
        mb: 2,
      }}
    >
      <Grid container>
        <Grid item xs={6}>
          <Typography
            sx={{
              fontSize: "24px",
              lineHeight: "28px",
              color: "#FFF",
              fontWeight: 700,
            }}
          >
            {props.title}
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              lineHeight: "22px",
              color: "#FFF",
              opacity: 0.6,
            }}
          >
            {props.description}
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <ArrowForward
            sx={{
              fontSize: "40px",
              color: "#FFF",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateOptionCard;
