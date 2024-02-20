import { Box, Modal as MuiModal, Typography } from "@mui/material";
import Colors from "../Theme/colors";
import React from "react";
import { Button } from "../Button/Button";
const TourModal = ({
  open,
  setOpen,
  onClick,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClick: () => void;
}): React.ReactNode => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { md: "30rem", xs: "100vw" },
    background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "1.5rem",
  };

  return (
    <MuiModal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="connectwallet-modal"
      aria-describedby="connect your wallet to the app"
    >
      <Box sx={style}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box
              onClick={() => setOpen(false)}
              component="img"
              sx={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                w: "16px",
                h: "16px",
                backgroundColor: Colors.inputsHover,
                borderRadius: "8px",
                cursor: "pointer",
              }}
              src="/x.svg"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box component="img" src="/banklocker.png" />
            <Typography
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: 700,
                mt: "2rem",
                mb: "1rem",
              }}
            >
              Welcome to Phoenix!
            </Typography>
            <Typography
              sx={{
                fontFamily: "Ubuntu",
                fontSize: "1rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                mb: "2rem",
              }}
            >
              We're thrilled to have you join our community! This brief guide
              will introduce you to the key aspects of our platform. Let’s get
              started!
            </Typography>
            <Button fullWidth onClick={onClick} label="Take the quick tour" />
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
};

export { TourModal };
