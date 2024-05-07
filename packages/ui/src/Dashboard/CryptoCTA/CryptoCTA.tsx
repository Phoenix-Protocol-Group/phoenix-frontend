import { Box, Typography } from "@mui/material";
import { Button } from "../../Button/Button";
import React from "react";
import { CryptoCTAProps } from "@phoenix-protocol/types";

const CryptoCTA = ({ onClick }: CryptoCTAProps) => {
  return (
    <Box
      sx={{
        borderRadius: "24px",
        border: "2px solid #E2621B",
        p: "2.5rem",
        height: "26rem",
        background:
          "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box component="img" src="/banklocker.png" sx={{ mt: "-80px" }} />
        <Typography
          sx={{
            fontSize: "2.5rem",
            fontFamily: "Poppins",
            lineHeight: "3.125rem",
          }}
        >
          Need More
        </Typography>
        <Typography
          sx={{
            fontSize: "2.5rem",
            fontWeight: 900,
            fontFamily: "Poppins",
            lineHeight: "3.125rem",
          }}
        >
          Crypto?
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", opacity: 0.4, mt: "0.5rem" }}>
          You can easily deposit now!
        </Typography>
        <Button
          sx={{ width: "100%", mt: "1.8rem" }}
          //@ts-ignore
          variant="primary"
          onClick={onClick}
        >
          Buy Now!
        </Button>
      </Box>
    </Box>
  );
};

export default CryptoCTA;
