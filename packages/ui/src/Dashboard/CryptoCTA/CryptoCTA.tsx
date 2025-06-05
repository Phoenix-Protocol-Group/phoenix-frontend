import { Box, Typography } from "@mui/material";
import { Button } from "../../Button/Button";
import React from "react";
import { CryptoCTAProps } from "@phoenix-protocol/types";

const CryptoCTA = ({ onClick }: CryptoCTAProps) => {
  return (
    <Box
      sx={{
        borderRadius: "12px",
        border: "1px solid var(--primary-500, #F97316)",
        p: "1.5rem",
        height: "26rem",
        background: "rgba(226, 73, 26, 0.10)",
        mt: "1.5rem",
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
            fontSize: "2rem",
            fontFamily: "Ubuntu",
            lineHeight: "2.5rem",
            color: "var(--neutral-50, #FAFAFA)",
          }}
        >
          Need More
        </Typography>
        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: 700,
            fontFamily: "Ubuntu",
            lineHeight: "2.5rem",
            color: "var(--neutral-50, #FAFAFA)",
          }}
        >
          Crypto?
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            opacity: 0.6,
            mt: "0.5rem",
            color: "var(--neutral-300, #D4D4D4)",
          }}
        >
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
