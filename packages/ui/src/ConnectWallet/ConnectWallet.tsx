import React, { useState, useCallback, useEffect } from "react";
import {
  Connector,
  ConnectWalletProps,
  OptionComponentProps,
} from "@phoenix-protocol/types";
import {
  Box,
  Modal,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../Button/Button";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../Theme/styleConstants";
import CarouselComponent from "./Carousel";
import CloseIcon from "@mui/icons-material/Close";

/**
 * OptionComponent for displaying individual wallet options
 */
const OptionComponent = ({
  connector,
  onClick,
  selected,
  allowed,
}: OptionComponentProps & { allowed: boolean }) => {
  return (
    <motion.div
      whileHover={allowed ? { scale: 1.02 } : {}}
      whileTap={allowed ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        onClick={allowed ? onClick : undefined}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          padding: { md: spacing.md, xs: spacing.sm },
          alignItems: "center",
          gap: spacing.xs,
          background: colors.neutral[900],
          border: selected
            ? `1px solid ${colors.primary.main}`
            : `1px solid ${colors.neutral[700]}`,
          width: "100%",
          marginTop: spacing.sm,
          borderRadius: borderRadius.md,
          transition: "all 0.3s ease",
          opacity: allowed ? 1 : 0.6,
          cursor: allowed ? "pointer" : "default",
          boxShadow: selected
            ? `0 0 16px rgba(${colors.primary.gradient}, 0.15)`
            : "none",
        }}
      >
        <Box
          component="img"
          src={connector.iconUrl}
          alt={connector.name}
          sx={{
            width: "37px",
            height: "37px",
            borderRadius: "50%",
            objectFit: "contain",
            background: colors.neutral[800],
            padding: spacing.xs,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        />
        <Box
          sx={{
            flex: 1,
            textAlign: { xs: "center", md: "left" },
            mt: { xs: 1, md: 0 },
          }}
        >
          <Typography
            sx={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeights.medium,
              color: colors.neutral[50],
              mb: 0.5,
            }}
          >
            {connector.name}
          </Typography>
          {!allowed && (
            <Typography
              sx={{
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeights.regular,
                color: colors.neutral[400],
                display: { xs: "none", md: "block" },
              }}
            >
              Not installed
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

/**
 * Loading screen when connecting to a wallet
 */
const WalletConnectingScreen = ({ connector, onBack }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Box
      sx={{
        display: "flex",
        padding: spacing.lg,
        flexDirection: "column",
        alignItems: "center",
        borderRadius: borderRadius.lg,
        background: colors.neutral[800],
        border: `1px solid ${colors.neutral[700]}`,
      }}
    >
      <motion.img
        src={connector?.iconUrl || "/cryptoIcons/pho.svg"}
        alt="Loading Wallet"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          marginBottom: spacing.md,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <Typography
        sx={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeights.bold,
          color: colors.neutral[50],
          mt: spacing.md,
        }}
      >
        Opening {connector?.name}
      </Typography>
      <Typography
        sx={{
          fontSize: typography.fontSize.sm,
          color: colors.neutral[400],
          mb: spacing.lg,
          textAlign: "center",
        }}
      >
        Please confirm the connection request in the {connector?.name} app
      </Typography>
      <Button sx={{ width: "100%" }} onClick={onBack} type="secondary">
        Back
      </Button>
    </Box>
  </motion.div>
);

/**
 * Information slides about crypto wallets
 */
const InfoSlides = () => {
  const items = [
    {
      title: "What are wallets?",
      content:
        "Wallets are used to send, receive, and access all your digital assets like PHO and XLM.",
      image: "/wallet-3.png",
    },
    {
      title: "No accounts. No passwords.",
      content:
        "Use your wallet to sign into many different platforms. No unique accounts or passwords.",
      image: "/wallet-2.png",
    },
    {
      title: "Your wallet, your keys.",
      content:
        "Your wallet is your key to the Stellar network. Keep it safe and secure. Phoenix Protocol never has access to your funds.",
      image: "/wallet-1.png",
    },
  ];

  return (
    <Box>
      <CarouselComponent items={items} />
    </Box>
  );
};

/**
 * Main ConnectWallet component
 */
const ConnectWallet = ({
  open,
  setOpen,
  connectors,
  connect,
}: ConnectWalletProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Connector | undefined>(undefined);
  const [allowedConnectors, setAllowedConnectors] = useState<Connector[]>([]);
  const [disallowedConnectors, setDisallowedConnectors] = useState<Connector[]>(
    []
  );
  const [loadingConnectors, setLoadingConnectors] = useState(true);

  // Check which connectors are allowed (installed)
  useEffect(() => {
    let isMounted = true;

    const checkConnectors = async () => {
      if (!isMounted) return;

      setLoadingConnectors(true);
      const allowed: Connector[] = [];
      const disallowed: Connector[] = [];

      for (const connector of connectors) {
        if (!isMounted) break;

        try {
          const isAllowed = await connector.isConnected();
          if (isAllowed) {
            allowed.push(connector);
          } else {
            disallowed.push(connector);
          }
        } catch (error) {
          disallowed.push(connector);
        }
      }

      if (isMounted) {
        setAllowedConnectors(allowed);
        setDisallowedConnectors(disallowed);
        setLoadingConnectors(false);
      }
    };

    if (open) {
      // Use a stable reference to the connectors array
      const connectorsCopy = [...connectors];
      checkConnectors();
    }

    return () => {
      isMounted = false;
    };
  }, [open]); // Remove connectors from dependency array to prevent re-renders

  // Handle connecting to a wallet
  const handleConnect = useCallback(
    async (connector: Connector) => {
      setLoading(true);
      setSelected(connector);

      try {
        await connect(connector);
        // Close the modal after successful connection
        setOpen(false);
      } catch (error) {
        console.error("Wallet connection failed:", error);
        setLoading(false);
      }
    },
    [connect, setOpen]
  );

  // Handle going back from the loading screen
  const handleBack = useCallback(() => {
    setLoading(false);
    setSelected(undefined);
  }, []);

  // Handle closing the modal
  const handleClose = useCallback(() => {
    setOpen(false);

    // Reset state after animation
    setTimeout(() => {
      setLoading(false);
      setSelected(undefined);
      // Reset connector states to prevent stale data
      setAllowedConnectors([]);
      setDisallowedConnectors([]);
      setLoadingConnectors(true);
    }, 300);
  }, [setOpen]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="connect-wallet-modal"
      aria-describedby="select a wallet to connect to the app"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: "800px" },
          maxHeight: { xs: "90vh", md: "80vh" },
          outline: "none",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              borderRadius: borderRadius.lg,
              backgroundColor: colors.neutral[900],
              border: `1px solid ${colors.neutral[700]}`,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Grid container sx={{ height: "100%" }}>
              {/* Left Side - Wallet Selection */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  padding: spacing.lg,
                  height: "100%",
                  overflow: "auto",
                  borderRight: {
                    md: `1px solid ${colors.neutral[800]}`,
                    xs: "none",
                  },
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: colors.primary.main,
                    borderRadius: borderRadius.md,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: spacing.md,
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: typography.fontSize.xl,
                      fontWeight: typography.fontWeights.bold,
                      color: colors.neutral[50],
                    }}
                  >
                    Connect Wallet
                  </Typography>
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box
                      sx={{
                        cursor: "pointer",
                        opacity: 0.7,
                        color: colors.neutral[300],
                        "&:hover": { opacity: 1 },
                      }}
                      onClick={handleClose}
                    >
                      <CloseIcon />
                    </Box>
                  </motion.div>
                </Box>

                <Typography
                  sx={{
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[400],
                    mb: spacing.md,
                  }}
                >
                  Start by connecting with one of the wallets below.
                </Typography>

                {loadingConnectors ? (
                  // Loading skeleton
                  [...Array(4)].map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        height: "60px",
                        borderRadius: borderRadius.md,
                        background: colors.neutral[800],
                        mb: spacing.sm,
                        animation: "pulse 1.5s infinite ease-in-out",
                        "@keyframes pulse": {
                          "0%": { opacity: 0.5 },
                          "50%": { opacity: 0.8 },
                          "100%": { opacity: 0.5 },
                        },
                      }}
                    />
                  ))
                ) : (
                  // Wallet options
                  <Box>
                    {allowedConnectors.map((connector) => (
                      <OptionComponent
                        key={connector.id}
                        connector={connector}
                        selected={selected === connector}
                        onClick={() => handleConnect(connector)}
                        allowed={true}
                      />
                    ))}
                    {disallowedConnectors.map((connector) => (
                      <OptionComponent
                        key={connector.id}
                        connector={connector}
                        selected={selected === connector}
                        onClick={() => {}}
                        allowed={false}
                      />
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Right Side - Loading or Info */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  padding: spacing.lg,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <WalletConnectingScreen
                      key="loading"
                      connector={selected}
                      onBack={handleBack}
                    />
                  ) : (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      style={{ width: "100%" }}
                    >
                      <InfoSlides />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Grid>
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Modal>
  );
};

export { ConnectWallet };
