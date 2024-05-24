import { Box } from "@mui/material";
import React from "react";

const Loader = () => {
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{
        maxWidth: "420px"
      }}>
      <video autoPlay loop muted>
        <source src="/loader.webm" type="video/webm" />
      </video>
      </Box>
    </Box>
  );
};

export default Loader;
