import React from "react";
import { Box, Typography } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { BackButtonProps } from "@phoenix-protocol/types";

const BackButton = (props: BackButtonProps) => {
  return (
    <Box
      onClick={props.onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
        zIndex: 2,
        "&:hover .backButton-label": {
          textDecoration: "underline",
        },
      }}
    >
      <KeyboardBackspaceIcon sx={{ fontSize: "24px", mr: 1 }} />
      <Typography
        className="backButton-label"
        sx={{
          fontSize: "16px",
          fontWeight: 700,
          lineHeight: "24px",
        }}
      >
        Back
      </Typography>
    </Box>
  );
};

export default BackButton;
