import React, { useCallback } from "react";
import {
  Box,
  Typography,
  Modal as MuiModal,
  Avatar,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Colors from "../../Theme/colors";
import { AssetInfoModalProps } from "@phoenix-protocol/types";

const AssetInfoModal = ({ open, onClose, asset }: AssetInfoModalProps) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(512px, 90%)",
    maxWidth: "100vw",
    background: "var(--neutral-900, #171717)",
    borderRadius: "12px",
    boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.6)",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "24px",
    overflow: "hidden",
  };

  const handleCopyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="asset-info-modal"
      aria-describedby="Asset Information Modal"
    >
      <Box sx={style}>
        {/* Background Icon */}
        {asset.tomlInfo.image && (
          <Box
            component="img"
            src={asset.tomlInfo.image}
            alt="Background Icon"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "250px",
              height: "250px",
              opacity: 0.05,
              transform: "translate(25%, 25%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "var(--neutral-300, #D4D4D4)",
            backgroundColor: "transparent",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "var(--neutral-50, #FAFAFA)",
              fontWeight: 600,
              fontSize: "1.25rem",
              mb: 1,
              fontFamily: "Ubuntu",
            }}
          >
            Asset Information
          </Typography>
        </Box>

        {/* Asset Details */}
        <Box
          sx={{
            borderRadius: "12px",
            border: "1px solid var(--neutral-700, #404040)",
            p: "1rem",
            width: "100%",
            background: "var(--neutral-800, #262626)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontFamily: "Ubuntu",
                fontWeight: 500,
                color: "var(--neutral-50, #FAFAFA)",
              }}
            >
              Quick facts about
            </Typography>
            {asset.tomlInfo.image && (
              <Box sx={{ ml: 0.5, mr: 0.25 }}>
                <Avatar
                  src={asset.tomlInfo.image}
                  sx={{ width: "1.25rem", height: "1.25rem" }}
                />
              </Box>
            )}
            <Typography
              sx={{
                fontSize: "1rem",
                fontFamily: "Ubuntu",
                color: "var(--neutral-50, #FAFAFA)",
              }}
            >
              {asset.tomlInfo.code}:
            </Typography>
          </Box>
          <Table size="small" aria-label="asset details">
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    color: "var(--neutral-300, #D4D4D4)",
                    borderBottom: "none",
                    py: 0.5,
                  }}
                >
                  Domain
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--neutral-50, #FAFAFA)",
                    fontWeight: 400,
                    borderBottom: "none",
                    py: 0.5,
                  }}
                >
                  {asset.domain}
                </TableCell>
              </TableRow>
              {asset.supply && (
                <TableRow>
                  <TableCell
                    sx={{
                      color: "var(--neutral-300, #D4D4D4)",
                      borderBottom: "none",
                      py: 0.5,
                    }}
                  >
                    Total Supply
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--neutral-50, #FAFAFA)",
                      fontWeight: 400,
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "none",
                      py: 0.5,
                    }}
                  >
                    {(Number(asset.supply) / 10 ** 7).toFixed()}
                    {asset.tomlInfo.image && (
                      <Avatar
                        src={asset.tomlInfo.image}
                        sx={{ width: 20, height: 20, ml: 0.5 }}
                      />
                    )}
                    {asset.tomlInfo.code}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell
                  sx={{
                    color: "var(--neutral-300, #D4D4D4)",
                    borderBottom: "none",
                    py: 0.5,
                  }}
                >
                  First Transaction
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--neutral-50, #FAFAFA)",
                    fontWeight: 400,
                    borderBottom: "none",
                    py: 0.5,
                  }}
                >
                  {new Date(asset.created * 1000).toLocaleString("en-US", {
                    timeZone: "UTC",
                    dateStyle: "medium",
                    timeStyle: "medium",
                  }) + " UTC"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    color: "var(--neutral-300, #D4D4D4)",
                    borderBottom: "none",
                    py: 0.5,
                  }}
                >
                  Trustlines
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--neutral-50, #FAFAFA)",
                    fontWeight: 400,
                    borderBottom: "none",
                    py: 0.5,
                  }}
                >
                  {asset.trustlines[2]} funded / {asset.trustlines[0]} total
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    color: "var(--neutral-300, #D4D4D4)",
                    borderBottom: "none",
                    py: 0.5,
                  }}
                >
                  Total Payments
                </TableCell>
                <TableCell
                  sx={{
                    color: "var(--neutral-50, #FAFAFA)",
                    fontWeight: 400,
                    borderBottom: "none",
                    py: 0.5,
                  }}
                >
                  {new Intl.NumberFormat("en-US").format(asset.payments)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Box>
    </MuiModal>
  );
};

export { AssetInfoModal };
