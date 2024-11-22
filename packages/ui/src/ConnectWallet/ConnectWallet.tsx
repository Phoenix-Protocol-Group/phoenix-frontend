import React, { useState, useCallback, useMemo } from "react";
import {
  Connector,
  ConnectWalletProps,
  OptionComponentProps,
} from "@phoenix-protocol/types";
import { Box, Modal, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Button as PhoenixButton } from "../Button/Button";
import Colors from "../Theme/colors";

/**
 * OptionComponent
 * Renders an individual wallet option with hover effects and selection state.
 *
 * @param {OptionComponentProps} props - Contains wallet connector, click handler, and selection status.
 * @returns {JSX.Element} The wallet option component.
 */
const OptionComponent = ({
  connector,
  onClick,
  selected,
}: OptionComponentProps) => {
  const hoverStyles = {
    background:
      "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
    cursor: "pointer",
    border: "2px solid #E2621B",
    transition: "all 0.2s ease-in-out",
  };

  const baseStyles = {
    display: "flex",
    padding: "1.125rem 1.5rem",
    alignItems: "center",
    gap: "1rem",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
    border: "2px solid transparent",
    width: "100%",
    marginTop: "1.5rem",
    borderRadius: "8px",
    transition: "all 0.2s ease-in-out",
    "&:hover": hoverStyles,
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Box
        onClick={onClick}
        sx={selected ? { ...baseStyles, ...hoverStyles } : baseStyles}
      >
        <img
          src={connector.iconUrl}
          width="37"
          height="37"
          alt={connector.name}
        />
        <Typography>{connector.name}</Typography>
      </Box>
    </motion.div>
  );
};

/**
 * ConnectWallet
 * Modal to display wallet connection options and handle the connection process.
 *
 * @param {ConnectWalletProps} props - Props for managing modal state, connectors, and the connect function.
 * @returns {JSX.Element} The ConnectWallet modal component.
 */
const ConnectWallet = ({
  open,
  setOpen,
  connectors,
  connect,
}: ConnectWalletProps): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Connector | undefined>(undefined);

  /**
   * Handles wallet connection.
   * Initiates the connection process for the selected connector.
   *
   * @param {Connector} connector - The wallet connector to connect with.
   */
  const handleConnect = useCallback(
    async (connector: Connector) => {
      setLoading(true);
      try {
        await connect(connector);
      } catch (error) {
        console.log("Wallet connection failed:", error);
      } finally {
        setLoading(false);
        setOpen(false);
      }
    },
    [connect, setOpen]
  );

  /**
   * Handles the "Back" button action during the loading state.
   */
  const handleBack = useCallback(() => {
    setLoading(false);
    setSelected(undefined);
  }, []);

  const modalStyle = useMemo(
    () => ({
      position: "absolute" as "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: { md: 512, xs: "96vw" },
      background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
      borderRadius: "16px",
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem",
    }),
    []
  );

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="connectwallet-modal"
      aria-describedby="connect your wallet to the app"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
        }}
      >
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: 24, fontWeight: 700 }}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              Connect Wallet
            </Typography>
            <Box
              sx={{
                display: "flex",
                padding: "0.25rem",
                backgroundColor: Colors.inputsHover,
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => setOpen(false)}
            >
              <img
                src="/x.svg"
                alt="Close"
                style={{ width: "1.5rem", height: "1.5rem" }}
              />
            </Box>
          </Box>
          {!loading ? (
            <>
              <Typography
                sx={{ fontSize: 14, opacity: 0.4, marginTop: "1.5rem" }}
              >
                Start by connecting with one of the wallets below.
              </Typography>
              {connectors.map((connector) => (
                <OptionComponent
                  key={connector.id}
                  connector={connector}
                  selected={selected === connector}
                  onClick={() => setSelected(connector)}
                />
              ))}
              <PhoenixButton
                disabled={!selected}
                sx={{ marginTop: "1.5rem", width: "100%" }}
                onClick={() => selected && handleConnect(selected)}
              >
                Continue
              </PhoenixButton>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Box
                sx={{
                  display: "flex",
                  padding: "1.5rem",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "#2C2C31",
                  borderRadius: "16px",
                  marginTop: "1.5rem",
                }}
              >
                <img
                  src={
                    selected?.id === "freighter"
                      ? "/image-105.png"
                      : selected?.iconUrl || ""
                  }
                  alt="Loading Wallet"
                  style={{ width: "100%" }}
                />
                <Typography sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  Opening {selected?.name}
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", opacity: 0.4, mb: 2 }}>
                  Please confirm in the {selected?.name} app
                </Typography>
                <PhoenixButton
                  sx={{ width: "100%" }}
                  onClick={handleBack}
                  type="secondary"
                >
                  Back
                </PhoenixButton>
              </Box>
            </motion.div>
          )}
        </Box>
      </motion.div>
    </Modal>
  );
};

export { ConnectWallet };
