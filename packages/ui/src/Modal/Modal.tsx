import React from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Modal as MuiModal,
  Typography,
} from "@mui/material";
import { Button } from "../Button/Button";
import { ModalProps } from "@phoenix-protocol/types";
import SwapAnimation from "./SwapAnimation";
import { motion } from "framer-motion";
import { colors, typography, spacing, borderRadius, shadows } from "../Theme/styleConstants";

const Modal = ({
  type,
  open,
  title,
  description,
  tokens,
  tokenAmounts,
  tokenTitles,
  setOpen,
  onButtonClick,
  error,
}: ModalProps) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 317,
    maxWidth: "calc(100vw - 16px)",
    background: colors.gradients.card,
    borderRadius: borderRadius.lg,
    display: "flex",
    flexDirection: "column" as "column",
    padding: spacing.md,
    boxShadow: shadows.card,
  };

  const tokenHeaderStyle = {
    color: "rgba(255, 255, 255, 0.70)",
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeights.regular,
    fontFamily: typography.fontFamily,
    lineHeight: "140%",
    marginBottom: spacing.xs,
  };

  const tokenIconStyle = {
    width: "24px",
    height: "24px",
    marginRight: spacing.xs,
  };

  const tokenAmountStyle = {
    color: colors.neutral[50],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeights.bold,
    fontFamily: typography.fontFamily,
    lineHeight: "140%",
  };

  const getAsset = () => {
    if (type === "SUCCESS") {
      return "/check.svg";
    } else if (type === "WARNING") {
      return "/warning.svg";
    } else if (type === "ERROR") {
      return "/cross.svg";
    }
    return "";
  };

  const phoIconStyle = {
    position: "relative",
    top: "-4px",
  };

  return (
    <MuiModal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
              {type === "LOADING" || type === "LOADING_SWAP" ? (
                <Box
                  sx={{
                    height: "98px",
                    width: type === "LOADING_SWAP" ? "60%" : "98px",
                    marginBottom: spacing.md,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {type === "LOADING_SWAP" ? (
                    // @ts-ignore
                    <SwapAnimation fromToken={tokens[0]} toToken={tokens[1]} />
                  ) : (
                    <CircularProgress sx={{ color: colors.primary.main }} />
                  )}
                </Box>
              ) : (
                <Box
                  component="img"
                  sx={{
                    height: "98px",
                    width: "98px",
                    margin: "0 auto",
                    marginBottom: spacing.md,
                  }}
                  src={getAsset()}
                />
              )}
              <Typography
                sx={{
                  color: colors.neutral[50],
                  textAlign: "center",
                  fontSize: typography.fontSize.xxl,
                  fontWeight: typography.fontWeights.bold,
                  fontFamily: typography.fontFamily,
                }}
              >
                {title}
              </Typography>

              {!!tokens && type !== "LOADING_SWAP" && (
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: borderRadius.sm,
                      width: "100%",
                      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
                      padding: spacing.md,
                      marginBottom: spacing.md,
                      marginTop: spacing.lg,
                    }}
                  >
                    <Grid container>
                      <Grid item xs={tokens.length > 1 ? 6 : 12}>
                        <Typography sx={tokenHeaderStyle}>
                          {tokenTitles[0]}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Box
                            component="img"
                            sx={
                              tokens[0].name === "PHO"
                                ? { ...tokenIconStyle, ...phoIconStyle }
                                : tokenIconStyle
                            }
                            src={tokens[0].icon}
                          />
                          <Typography sx={tokenAmountStyle}>
                            {tokenAmounts[0]}
                          </Typography>
                        </Box>
                      </Grid>
                      {tokens.length > 1 && (
                        <Grid item xs={6}>
                          <Typography sx={tokenHeaderStyle}>
                            {tokenTitles[1]}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <Box
                              component="img"
                              sx={
                                tokens[1].name === "PHO"
                                  ? { ...tokenIconStyle, ...phoIconStyle }
                                  : tokenIconStyle
                              }
                              src={tokens[1].icon}
                            />
                            <Typography sx={tokenAmountStyle}>
                              {tokenAmounts[1]}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Box>
              )}

              {description && (
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.70)",
                      textAlign: "center",
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeights.regular,
                      fontFamily: typography.fontFamily,
                      lineHeight: "140%",
                      marginBottom: spacing.xl,
                      marginTop: spacing.xs,
                    }}
                  >
                    {description}
                  </Typography>
                </Box>
              )}
              {error && (
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.70)",
                      textAlign: "center",
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeights.regular,
                      fontFamily: typography.fontFamily,
                      lineHeight: "140%",
                      marginBottom: spacing.xl,
                      marginTop: spacing.xs,
                    }}
                  >
                    {error}
                  </Typography>
                </Box>
              )}
              {onButtonClick && type !== "LOADING_SWAP" && error && (
                <Button
                  onClick={onButtonClick}
                  sx={{
                    width: "100%",
                    display: type === "LOADING" ? "none" : "block",
                  }}
                  label={
                    error ? "Copy error to clipboard" : "Transaction Details"
                  }
                />
              )}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </MuiModal>
  );
};

export { Modal };
