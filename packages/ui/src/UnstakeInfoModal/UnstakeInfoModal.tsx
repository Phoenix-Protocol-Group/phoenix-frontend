import React from "react";
import {
  Box,
  Typography,
  Modal as MuiModal,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Button } from "../Button/Button";
import { UnstakeInfoModalProps } from "@phoenix-protocol/types";
import { colors, typography, spacing, borderRadius, shadows } from "../Theme/styleConstants";

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
    background: colors.neutral[900],
    borderRadius: borderRadius.lg,
    display: "flex",
    flexDirection: "column" as "column",
    padding: spacing.lg,
    boxShadow: shadows.card,
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
                width: "16px",
                height: "16px",
                backgroundColor: colors.neutral[800],
                borderRadius: borderRadius.sm,
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
                color: colors.neutral[50],
                textAlign: "center",
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeights.bold,
                fontFamily: typography.fontFamily,
                marginBottom: spacing.md,
              }}
            >
              Warning
            </Typography>
            
            <Typography
              sx={{
                color: colors.neutral[300],
                textAlign: "center",
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.regular,
                fontFamily: typography.fontFamily,
                lineHeight: "140%",
                marginBottom: spacing.lg,
              }}
            >
              Unstaking your tokens will result in the loss of any unclaimed rewards.
              Please make sure to claim your rewards before unstaking.
            </Typography>
            
            <Box sx={{ display: "flex", gap: spacing.md, width: "100%", justifyContent: "space-around" }}>
              <Button 
                type="secondary" 
                label="Cancel" 
                onClick={onClose}
                sx={{ flex: 1 }}
              />
              <Button 
                type="primary" 
                label="Confirm Unstake" 
                onClick={onConfirm}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
};

export { UnstakeInfoModal };
