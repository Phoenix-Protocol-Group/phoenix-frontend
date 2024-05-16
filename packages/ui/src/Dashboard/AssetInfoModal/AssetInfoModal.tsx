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
import { Button } from "../../Button/Button";
import { AssetInfoModalProps } from "@phoenix-protocol/types";
import { CopyAll } from "@mui/icons-material";

const AssetInfoModal = ({
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

  const handleCopyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <MuiModal
      open={open}
      aria-labelledby="disclaimer-modal"
      aria-describedby="Disclaimer Message"
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
              Asset Information
            </Typography>

            <Box
              sx={{
                borderRadius: "24px",
                border: "2px solid #E2621B",
                p: "1rem 2.5rem 2.5rem 2.5rem",
                width: "100%",
                mt: 2,
                background:
                  "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                <Typography
                  sx={{
                    fontSize: "1.125rem",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                  }}
                >
                  Quick facts about
                </Typography>
                <Box sx={{ ml: 1, mr: 0.5 }}>
                  <Avatar
                    src={asset.tomlInfo.image}
                    sx={{ width: "1.5rem", height: "1.5rem" }}
                  />
                </Box>
                <Typography
                  sx={{ fontSize: "1.125rem", fontFamily: "Poppins" }}
                >
                  {asset.tomlInfo.code}:
                </Typography>
              </Box>
              <Table size="small" aria-label="asset details">
                <TableBody>
                  <TableRow>
                    <TableCell>Domain</TableCell>
                    <TableCell>{asset.domain}</TableCell>
                  </TableRow>
                  {asset.supply && (
                    <TableRow>
                      <TableCell>Total Supply</TableCell>
                      <TableCell sx={{ display: "flex", alignItems: "center" }}>
                        {(
                          Number(asset.supply) /
                          10 ** 7
                        ).toFixed()}
                        <Avatar
                          src={asset.tomlInfo.image}
                          sx={{ width: 24, height: 24, ml: 1 }}
                        />
                        {asset.tomlInfo.code}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell>First Transaction</TableCell>
                    <TableCell>
                      {new Date(asset.created * 1000).toLocaleString("en-US", {
                        timeZone: "UTC",
                        dateStyle: "medium",
                        timeStyle: "medium",
                      }) + " UTC"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Trustlines</TableCell>
                    <TableCell>
                      {asset.trustlines[2]} funded / {asset.trustlines[0]} total
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Payments</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US").format(asset.payments)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
};

export { AssetInfoModal };
