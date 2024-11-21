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
    background: "#1F1F1F",
    borderRadius: "16px",
    boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.6)",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "24px",
    overflow: "hidden",
    position: "relative",
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
            color: "#FFF",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#FFF",
              fontWeight: 700,
              fontSize: "1.5rem",
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
            borderRadius: "16px",
            border: "1px solid #444",
            p: "1.5rem",
            width: "100%",
            background: "#2A2A2A",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", paddingBottom: 2 }}>
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontFamily: "Poppins",
                fontWeight: 600,
                color: "#FFF",
              }}
            >
              Quick facts about
            </Typography>
            {asset.tomlInfo.image && (
              <Box sx={{ ml: 1, mr: 0.5 }}>
                <Avatar
                  src={asset.tomlInfo.image}
                  sx={{ width: "1.5rem", height: "1.5rem" }}
                />
              </Box>
            )}
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontFamily: "Poppins",
                color: "#FFF",
              }}
            >
              {asset.tomlInfo.code}:
            </Typography>
          </Box>
          <Table size="small" aria-label="asset details">
            <TableBody>
              <TableRow>
                <TableCell sx={{ color: "#BDBEBE", borderBottom: "none" }}>
                  Domain
                </TableCell>
                <TableCell
                  sx={{ color: "#FFF", fontWeight: 600, borderBottom: "none" }}
                >
                  {asset.domain}
                </TableCell>
              </TableRow>
              {asset.supply && (
                <TableRow>
                  <TableCell sx={{ color: "#BDBEBE", borderBottom: "none" }}>
                    Total Supply
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFF",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "none",
                    }}
                  >
                    {(Number(asset.supply) / 10 ** 7).toFixed()}
                    {asset.tomlInfo.image && (
                      <Avatar
                        src={asset.tomlInfo.image}
                        sx={{ width: 24, height: 24, ml: 1 }}
                      />
                    )}
                    {asset.tomlInfo.code}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell sx={{ color: "#BDBEBE", borderBottom: "none" }}>
                  First Transaction
                </TableCell>
                <TableCell
                  sx={{ color: "#FFF", fontWeight: 600, borderBottom: "none" }}
                >
                  {new Date(asset.created * 1000).toLocaleString("en-US", {
                    timeZone: "UTC",
                    dateStyle: "medium",
                    timeStyle: "medium",
                  }) + " UTC"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ color: "#BDBEBE", borderBottom: "none" }}>
                  Trustlines
                </TableCell>
                <TableCell
                  sx={{ color: "#FFF", fontWeight: 600, borderBottom: "none" }}
                >
                  {asset.trustlines[2]} funded / {asset.trustlines[0]} total
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ color: "#BDBEBE", borderBottom: "none" }}>
                  Total Payments
                </TableCell>
                <TableCell
                  sx={{ color: "#FFF", fontWeight: 600, borderBottom: "none" }}
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
