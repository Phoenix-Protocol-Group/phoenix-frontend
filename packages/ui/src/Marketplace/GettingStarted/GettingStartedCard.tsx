import { Box, Typography } from '@mui/material';
import { GettingStartedCardProps } from './GettingStarted';

const GettingStartedCard = (props: GettingStartedCardProps) => {
  return (
    <Box sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "12px",
      border: "1px solid #2C2C31",
      py: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "linear-gradient(180deg, #292B2C 0%, #222426 100%)",
      "&:after": {
        content: "' '",
        position: "absolute",
        top: "30%",
        width: "100%",
        height: "100%",
        background: "linear-gradient(360deg, rgba(226, 73, 26, 0.19) 0%, rgba(226, 73, 26, 0) 100%)"
      }
    }}>
      <Box
        component="img"
        sx={{
          maxWidth: "36px",
          mb: 1,
        }}
        alt="getting started page icon"
        src={props.image}
      />
      <Typography sx={{
        fontSize: "24px",
        fontWeight: 700,
        lineHeight: "28px",
        mb: 1,
        color: "#FFF"
      }}>
        {props.name}
      </Typography>
      <Typography sx={{
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "22px",
        color: "#FFF",
        opacity: 0.6,
        maxWidth: "200px",
        textAlign: "center"
      }}>
        {props.description}
      </Typography>
    </Box>
  );
};

export default GettingStartedCard;
