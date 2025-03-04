import { Box } from "@mui/material";
import React from "react";

const Loader = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "600px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <video autoPlay loop muted width={"100%"}>
          <source src="/loader.webm" width="100%" type="video/webm" />
        </video>
      </Box>
    </Box>
  );
};

export default Loader;
