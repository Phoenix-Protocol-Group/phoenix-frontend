import React from "react";
import { Box, Typography, Modal, Grid, TextField } from "@mui/material";
import Colors from "../../Theme/colors";
import { Button } from "../../Button/Button";

export interface CreatePoolModalProps {
  isOpen: boolean;
  setOpen: (val: boolean) => void;
  tokenAddressA: string;
  tokenAddressB: string;
  tokenChangeA: (val: string) => void;
  tokenChangeB: (val: string) => void;
  onClick: () => void;
}

const CreatePoolModal = ({
  isOpen,
  setOpen,
  tokenAddressA,
  tokenAddressB,
  tokenChangeA,
  tokenChangeB,
  onClick,
}: CreatePoolModalProps) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 412,
    background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "16px",
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setOpen(false)}
      aria-labelledby="createpool-modal"
      aria-describedby="create a pool"
    >
      <Box sx={style}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              Create pool
            </Typography>
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
              mt: 4,
            }}
          >
            <TextField
              value={tokenAddressA}
              placeholder="Token A Address"
              sx={{
                color: "white",
                width: "100%",
                mb: 1,
                "&::placeholder": {
                  color: "white",
                  opacity: 0.6,
                  fontSize: "0.8125rem!important",
                },
              }}
              onChange={(e) => tokenChangeA(e.target.value)}
              InputLabelProps={{
                sx: {
                  color: "white!important",
                  fontSize: "0.8125rem",
                  opacity: 0.6,
                  textAlign: "center",
                },
              }}
              InputProps={{
                sx: {
                  color: "white",
                  opacity: 0.6,
                  fontSize: "13px",
                  width: "100%",
                  borderRadius: "16px",
                  "&:hover fieldset": {
                    border: "1px solid #E2621B!important",
                  },
                  "&:focus-within fieldset, &:focus-visible fieldset": {
                    border: "2px solid #E2621B!important",
                    color: "white!important",
                  },
                },
              }}
            />
            <TextField
              value={tokenAddressB}
              placeholder="Token B Address"
              sx={{
                color: "white",
                width: "100%",
                mb: 1,
                "&::placeholder": {
                  color: "white",
                  opacity: 0.6,
                  fontSize: "0.8125rem!important",
                },
              }}
              onChange={(e) => tokenChangeB(e.target.value)}
              InputLabelProps={{
                sx: {
                  color: "white!important",
                  fontSize: "0.8125rem",
                  opacity: 0.6,
                  textAlign: "center",
                },
              }}
              InputProps={{
                sx: {
                  color: "white",
                  opacity: 0.6,
                  fontSize: "13px",
                  width: "100%",
                  borderRadius: "16px",
                  "&:hover fieldset": {
                    border: "1px solid #E2621B!important",
                  },
                  "&:focus-within fieldset, &:focus-visible fieldset": {
                    border: "2px solid #E2621B!important",
                    color: "white!important",
                  },
                },
              }}
            />
            <Typography sx={{ fontSize: "0.875rem", opacity: 0.7, mb: 1, px: 0.5 }}>
              Please note that pools are not activated until liquidity is
              provided. Pools inactive for 7 days will be automatically removed.
            </Typography>
            <Button
              onClick={onClick}
              sx={{
                width: "100%",
              }}
              label="Create Pool"
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreatePoolModal;
