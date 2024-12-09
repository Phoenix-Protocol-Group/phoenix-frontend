import React from "react";
import {
  Box,
  Typography,
  Modal as MuiModal,
  Grid,
  CircularProgress,
} from "@mui/material";
import Colors from "../Theme/colors";
import { Button } from "../Button/Button";
import { UnstakeInfoModalProps } from "@phoenix-protocol/types";

const UnstakeInfoModal = ({
  open,
  onConfirm,
  onClose,
}: UnstakeInfoModalProps) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 512,
    maxWidth: "calc(100vw - 16px)",
    background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "16px",
  };

  return (
    <MuiModal
      open={open}
      aria-labelledby="disclaimer-modal"
      aria-describedby="Disclaimer Message"
      sx={{
        zIndex: 1300,
      }}
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
              onClick={onClose}
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
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Disclaimer
            </Typography>

            <Box>
              <Typography
                sx={{
                  color:
                    "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
                  textAlign: "justify",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "140%",
                  marginBottom: "22px",
                  marginTop: "4px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                You are about to unstake. By doing so, you will lose the APR
                progress you've accumulated. Remember, your APR increases daily
                up to 60 days. If you unstake now, you'll need to start over
                from day one.
                <br />
                <br />
                Are you sure you want to proceed?
              </Typography>
              <Button onClick={onConfirm} label="Unstake" />
            </Box>
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
};

export { UnstakeInfoModal };
