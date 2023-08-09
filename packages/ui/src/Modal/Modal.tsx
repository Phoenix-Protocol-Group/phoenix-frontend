import React from "react";
import { Box, Typography, Modal as MuiModal, Grid } from "@mui/material";
import Colors from "../Theme/colors";
import { Button } from "../Button/Button";

export interface Token {
  name: string;
  icon: string;
  usdValue: number;
  amount: number;
  category: string;
}

type Type = "SUCCESS" | "WARNING" | "ERROR";

interface ModalProps {
  type: Type;
  title: string;
  description?: string;
  tokens?: Token[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onTxClick?: () => void;
}

const Modal = ({
  type,
  open,
  title,
  description,
  tokens,
  setOpen,
  onTxClick,
}: ModalProps): React.ReactNode => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 317,
    background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "16px",
  };

  const tokenHeaderStyle = {
    color: "rgba(255, 255, 255, 0.70)",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "140%",
    marginBottom: "8px",
  };

  const tokenIconStyle = {
    w: "24px",
    h: "24px",
    marginRight: "8px",
  };

  const tokenAmountStyle = {
    color: "#FFF",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: "140%",
  };

  const getAsset = () => {
    if (type == "SUCCESS") {
      return "check.svg";
    } else if (type == "WARNING") {
      return "cross.svg";
    } else if (type == "ERROR") {
      return "warning.svg";
    }
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
            }}
          >
            <Box
              component="img"
              sx={{
                h: "98px",
                w: "98px",
                margin: "0 auto",
                marginBottom: "12px",
              }}
              src={getAsset()}
            />
            <Typography
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>

            {!!tokens && (
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "8px",
                    width: "100%",
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
                    padding: "12px",
                    marginBottom: "16px",
                    marginTop: "20px",
                  }}
                >
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography sx={tokenHeaderStyle}>Swaped:</Typography>
                      <Box display="flex" alignItems="center">
                        <Box
                          component="img"
                          sx={tokenIconStyle}
                          src={tokens[0].icon}
                        />
                        <Typography sx={tokenAmountStyle}>
                          {tokens[0].amount}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={tokenHeaderStyle}>To:</Typography>
                      <Box display="flex" alignItems="center">
                        <Box
                          component="img"
                          sx={tokenIconStyle}
                          src={tokens[1].icon}
                        />
                        <Typography sx={tokenAmountStyle}>
                          {tokens[1].amount}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                {onTxClick && (
                  <Button
                    onClick={onTxClick}
                    sx={{
                      width: "100%",
                    }}
                    label="Transaction Details"
                  />
                )}
                {!onTxClick && (
                  <Button
                    onClick={() => setOpen(false)}
                    sx={{
                      width: "100%",
                    }}
                    label="Go Back"
                  />
                )}
              </Box>
            )}

            {!!description && (
              <Box>
                <Typography
                  sx={{
                    color:
                      "var(--content-medium-emphasis, rgba(255, 255, 255, 0.70))",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "140%",
                    marginBottom: "22px",
                    marginTop: "4px",
                  }}
                >
                  {description}
                </Typography>
                <Button
                  onClick={() => setOpen(false)}
                  sx={{
                    width: "100%",
                  }}
                  label="Go Back"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
};

export { Modal };
