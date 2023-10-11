import { Box } from "@mui/material";
import React from "react";

const Loader = () => {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <video autoPlay loop muted>
        <source src="/loader.webm" type="video/webm" />
      </video>
    </Box>
  );
};

export default Loader;
