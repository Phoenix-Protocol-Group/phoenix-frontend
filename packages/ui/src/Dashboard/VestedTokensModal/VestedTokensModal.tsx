import React, { useCallback } from "react";
import {
  Box,
  Typography,
  Modal as MuiModal,
  Grid,
  CircularProgress,
  Avatar,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import Colors from "../../Theme/colors";
import { AssetInfoModalProps } from "@phoenix-protocol/types";

const VestedTokensModal = ({
  open,
  onClose,
  asset,
}: AssetInfoModalProps): React.ReactNode => {
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
      aria-labelledby="vested-tokens-modal"
      aria-describedby="Vested "
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
              onClick={() => onClose()}
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
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Vested Tokens
            </Typography>

            
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
};

export { VestedTokensModal };
