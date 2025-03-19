import React, { useState, useCallback, useEffect } from "react";
import {
  Connector,
  ConnectWalletProps,
  OptionComponentProps,
} from "@phoenix-protocol/types";
import { Box, Modal, Typography, Grid, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { Button as PhoenixButton } from "../Button/Button";
import Colors from "../Theme/colors";
import { Carousel } from "./Carousel"; // Correct the import path

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
  allowed,
}: OptionComponentProps & { allowed: boolean }) => {
  const hoverStyles = {
    background:
      "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
    cursor: "pointer",
    border: "2px solid #E2621B",
    transition: "all 0.2s ease-in-out",
  };

  const baseStyles = {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    padding: { md: "1rem", xs: "0.75rem" },
    alignItems: "center",
    gap: "0.5rem",
    background: "var(--neutral-800, #262626)",
    border: "1px solid var(--neutral-700, #404040)",
    width: "100%",
    marginTop: "0.75rem",
    borderRadius: "8px",
    transition: "all 0.2s ease-in-out",
    opacity: allowed ? 1 : 0.5,
    marginRight: { xs: "0.5rem", md: 0 },
    "&:hover": hoverStyles,
  };

  return (
    <motion.div whileHover={{ scale: allowed ? 1.05 : 1 }}>
      <Box
        onClick={allowed ? onClick : undefined}
        sx={selected ? { ...baseStyles, ...hoverStyles } : baseStyles}
      >
        <img
          src={connector.iconUrl}
          width="37"
          height="37"
          alt={connector.name}
        />
        <Typography
          sx={{
            fontSize: {
              md: "1.1428571428571428rem",
              xs: "12px",
            },
            textAlign: "center",
            lineHeight: { xs: "1.2rem", md: "auto" },
            height: { xs: "2.4rem", md: "auto" },
          }}
        >
          {connector.name}
        </Typography>
        {!allowed && (
          <Typography
            sx={{
              fontSize: { md: 12, xs: 8 },
              display: { md: "block", xs: "none" },
              opacity: 0.6,
              marginLeft: { md: "0.5rem", xs: 0 },
            }}
          >
            Not installed
          </Typography>
        )}
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
  const [allowedConnectors, setAllowedConnectors] = useState<Connector[]>([]);
  const [disallowedConnectors, setDisallowedConnectors] = useState<Connector[]>(
    []
  );
  const [loadingConnectors, setLoadingConnectors] = useState(true);

  useEffect(() => {
    const checkConnectors = async () => {
      setLoadingConnectors(true);
      const allowed: Connector[] = [];
      const disallowed: Connector[] = [];
      for (const connector of connectors) {
        const isAllowed = await connector.isConnected();
        if (isAllowed) {
          allowed.push(connector);
        } else {
          disallowed.push(connector);
        }
      }
      setAllowedConnectors(allowed);
      setDisallowedConnectors(disallowed);
      setLoadingConnectors(false);
    };
    checkConnectors();
  }, [connectors]);

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

  const modalStyle = {
    position: "absolute" as "absolute",
    alignItems: { xs: "center", md: "flex-start" },
    top: { md: "50%", xs: "0" },
    left: "50%",
    transform: { md: "translate(-50%, -50%)", xs: "translate(-50%, 0)" },
    width: { xs: "96vh", md: 800 },
    maxWidth: "calc(100vw - 16px)",
    background: "var(--neutral-900, #171717)",
    borderRadius: "12px",
    flexDirection: { xs: "column", md: "column" },
    minHeight: "50vh",
    maxHeight: { md: "530px", xs: "100vh" },
  };

  const carouselItems = [
    {
      image: "/pho-wallets.png",
      title: "What are wallets?",
      text: "Wallets are used to send, receive, and access all your digital assets like PHO and XLM.",
    },
    {
      image: "/pho-wallets.png",
      title: "No accounts. No passwords.",
      text: "Use your wallet to sign into many different platforms. No unique accounts or passwords.",
    },
    {
      image: "/pho-wallets.png",
      title: "Your wallet, your keys.",
      text: "Your wallet is your key to the Stellar network. Keep it safe and secure. Phoenix Protocol never has access to your funds.",
    },
  ];

  const skeletonStyles = {
    display: "flex",
    padding: { md: "1.125rem 1.5rem", xs: "1rem" },
    alignItems: "center",
    gap: "0.25rem",
    width: "100%",
    marginTop: "1.25rem",
    borderRadius: "8px",
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="connectwallet-modal"
      aria-describedby="connect your wallet to the app"
    >
      <Grid
        container
        spacing={0}
        sx={{ marginTop: "1.5rem", height: "100%", ...modalStyle }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            overflowY: "auto",
            padding: "1.5rem 1rem",
            height: { md: "100%", xs: "auto" },
            flexGrow: { xs: 1, md: 0 }, // Adjust flexGrow for mobile
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#E2491A",
              borderRadius: "8px",
            },
            // Styles for Firefox
            scrollbarWidth: "thin", // Thin scrollbar width
            scrollbarColor: "#E2491A #2C2C31", // Thumb color and track color
            flexBasis: { md: "100%!important", xs: "auto" },
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
          {!loadingConnectors ? (
            <>
              <Typography
                sx={{ fontSize: 14, opacity: 0.4, marginBottom: "1.5rem" }}
              >
                Start by connecting with one of the wallets below.
              </Typography>
              <Box
                sx={{
                  display: {
                    xs: "flex",
                    md: "block",
                  },
                  maxWidth: "100%",
                  overflowX: { xs: "scroll", md: "visible" },
                }}
              >
                {allowedConnectors.map((connector) => (
                  <OptionComponent
                    key={connector.id}
                    connector={connector}
                    selected={selected === connector}
                    onClick={() => {
                      setSelected(connector);
                      handleConnect(connector);
                    }}
                    allowed={true}
                  />
                ))}
                {disallowedConnectors.map((connector) => (
                  <OptionComponent
                    key={connector.id}
                    connector={connector}
                    selected={selected === connector}
                    onClick={() => setSelected(connector)}
                    allowed={false}
                  />
                ))}
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: { md: "1.5rem", xs: "1rem" },
              }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height={60}
                sx={skeletonStyles}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={60}
                sx={skeletonStyles}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={60}
                sx={skeletonStyles}
              />
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ padding: "1.5rem 1rem", flexBasis: "100%!important" }}
        >
          {loading ? (
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
                  borderRadius: "16px",
                }}
              >
                <img
                  src={
                    selected?.id === "freighter"
                      ? "/image-105.png"
                      : selected?.iconUrl || ""
                  }
                  alt="Loading Wallet"
                  style={{ width: "180px" }}
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
          ) : (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{ fontSize: { md: 24, xs: 14 }, fontWeight: 700 }}
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Getting Started
                </Typography>
                <Carousel items={carouselItems} />
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Modal>
  );
};

export { ConnectWallet };
