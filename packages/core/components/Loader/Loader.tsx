import { Box } from "@mui/material";
import React from "react";

const Loader = () => {
  return (
    <Box>
      <video autoPlay loop muted>
        <source src="/loader.webm" type="video/webm" />
      </video>
    </Box>
  );
};

export default Loader;