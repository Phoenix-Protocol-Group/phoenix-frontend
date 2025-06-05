"use client";

import {
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  NoSsr,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../Button/Button";
import { MenuButton } from "./MenuButton";
import { AppBarProps } from "@phoenix-protocol/types";

const BalanceChip = ({ balance }: { balance: number }) => (
  <Chip
    icon={
      <Box
        component="img"
        src="/image-103.png"
        sx={{ width: 20, height: 20 }}
      />
    }
    label={
      <Typography
        sx={{
          fontSize: { xs: "11px", md: "13px" },
          lineHeight: "1.2",
          fontWeight: 500,
          color: "#FAFAFA",
        }}
      >
        {balance.toFixed(2)} XLM
      </Typography>
    }
    sx={{
      padding: { xs: "6px 8px", md: "8px 12px" },
      height: { xs: "28px", md: "32px" },
      background:
        "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(25, 25, 25, 0.8) 100%)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(249, 115, 22, 0.3)",
      borderRadius: "8px",
      color: "#FAFAFA",
      transition: "all 0.3s ease",
      "&:hover": {
        background:
          "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)",
        borderColor: "rgba(249, 115, 22, 0.5)",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
      },
      "& .MuiChip-icon": {
        margin: 0,
        marginRight: { xs: "4px", md: "6px" },
      },
      "& .MuiChip-label": {
        padding: 0,
      },
    }}
  />
);

const OptionMenu = ({
  disconnectWallet,
  walletAddress,
}: {
  disconnectWallet: () => void;
  walletAddress: string;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {walletAddress && (
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          sx={{
            color: "#FAFAFA",
            padding: { xs: "6px", md: "8px" },
            background: "rgba(249, 115, 22, 0.1)",
            border: "1px solid rgba(249, 115, 22, 0.2)",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            width: 30,
            height: 30,
            "&:hover": {
              background: "rgba(249, 115, 22, 0.2)",
              borderColor: "rgba(249, 115, 22, 0.4)",
              transform: "scale(1.05)",
            },
          }}
        >
          <MoreVertIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
        </IconButton>
      )}
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: isMobile ? "200px" : "220px",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(25, 25, 25, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(249, 115, 22, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          sx={{
            display: "block",
            padding: "12px 16px",
            "&:hover": {
              background: "rgba(249, 115, 22, 0.1)",
            },
          }}
          onClick={() => {
            navigator.clipboard.writeText(walletAddress);
            handleClose();
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "11px", md: "12px" },
              fontWeight: 500,
              color: "#A3A3A3",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}
          >
            Wallet Address
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ContentCopyIcon
              fontSize="small"
              sx={{
                color: "#F97316",
                fontSize: { xs: 14, md: 16 },
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "13px" },
                fontWeight: 500,
                color: "#FAFAFA",
                fontFamily: "monospace",
              }}
            >
              {walletAddress.slice(0, isMobile ? 12 : 15)}...
            </Typography>
          </Box>
        </MenuItem>
        <Divider
          sx={{
            background: "rgba(249, 115, 22, 0.2)",
            margin: "0 8px",
          }}
        />
        <MenuItem
          sx={{
            color: "#FAFAFA",
            padding: "12px 16px",
            "&:hover": {
              background: "rgba(220, 38, 38, 0.1)",
              color: "#FCA5A5",
            },
            transition: "all 0.3s ease",
          }}
          onClick={() => {
            disconnectWallet();
            handleClose();
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "13px", md: "14px" },
              fontWeight: 500,
            }}
          >
            Disconnect Wallet
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

const AppBar = ({
  balance,
  walletAddress,
  mobileNavOpen,
  sidebarOpen = false,
  scrollDirection,
  isAtTop = true,
  connectWallet,
  disconnectWallet,
  toggleMobileNav,
}: AppBarProps) => {
  const theme = useTheme();

  const largerThenMd = useMediaQuery("(min-width: 960px)", {
    noSsr: true, // Disable server-side rendering for this query
    defaultMatches: true, // Default to true for SSR compatibility
  });

  return (
    <NoSsr>
      <motion.div
        initial={{ y: 0 }}
        animate={{
          y: !largerThenMd && scrollDirection === "down" && !isAtTop ? -80 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
          duration: 0.3,
        }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: largerThenMd ? "2rem" : "1rem",
            background: largerThenMd
              ? "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(25, 25, 25, 0.8) 100%)"
              : "linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(25, 25, 25, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            left: {
              xs: 0,
              md: largerThenMd ? (sidebarOpen ? "240px" : "80px") : 0,
            },
            right: 0,
            width: "100%",
            height: { xs: "70px", md: "80px" }, // Slightly increased desktop height
            minHeight: { xs: "70px", md: "80px" },
            padding: { xs: "12px 16px", md: "20px 32px" }, // Increased desktop padding
            borderRadius: { xs: 0, md: "0 0 20px 20px" }, // Rounded bottom corners on desktop
            border: largerThenMd
              ? "1px solid rgba(249, 115, 22, 0.15)"
              : "none",
            borderTop: "none", // Remove top border for cleaner look
            borderBottom: !largerThenMd
              ? "1px solid rgba(249, 115, 22, 0.2)"
              : undefined,
            boxShadow: largerThenMd
              ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(249, 115, 22, 0.1)"
              : "0 4px 20px rgba(0, 0, 0, 0.5)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Better easing
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: largerThenMd
                ? "linear-gradient(135deg, rgba(249, 115, 22, 0.02) 0%, rgba(251, 146, 60, 0.02) 50%, rgba(249, 115, 22, 0.02) 100%)"
                : "linear-gradient(135deg, rgba(249, 115, 22, 0.03) 0%, rgba(251, 146, 60, 0.03) 50%, rgba(249, 115, 22, 0.03) 100%)",
              borderRadius: { xs: 0, md: "0 0 20px 20px" },
              zIndex: -1,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, md: 2 },
            }}
          >
            <motion.img
              src={largerThenMd ? "/logo.png" : "/logo_icon.svg"}
              alt="Phoenix Logo"
              style={{
                height: largerThenMd ? "44px" : "36px", // Slightly larger
                width: "auto",
                filter: "brightness(1.1)",
                cursor: "pointer",
              }}
              whileHover={{
                filter:
                  "brightness(1.2) drop-shadow(0 0 12px rgba(249, 115, 22, 0.4))",
                scale: 1.05,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            {largerThenMd && (
              <Box
                sx={{
                  height: "28px", // Slightly taller
                  width: "1px",
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(249, 115, 22, 0.4) 50%, transparent 100%)",
                  mx: 1.5, // More spacing
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, md: 2 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, md: 1 },
              }}
            >
              {walletAddress && balance >= 0 && (
                <BalanceChip balance={balance} />
              )}
              <OptionMenu
                walletAddress={walletAddress || ""}
                disconnectWallet={disconnectWallet}
              />
              {(!walletAddress || balance < 0) && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button
                    className={"connect-wallet"}
                    size={largerThenMd ? "medium" : "small"}
                    sx={{
                      minWidth: { xs: "110px", md: "130px" }, // Slightly wider
                      padding: { xs: "10px 16px", md: "12px 20px" }, // Better padding
                      fontSize: { xs: "12px", md: "14px" },
                      fontWeight: 600, // Slightly bolder
                      background:
                        "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
                      border: "1px solid rgba(249, 115, 22, 0.3)",
                      boxShadow: "0 4px 20px rgba(249, 115, 22, 0.3)",
                      borderRadius: "12px", // More rounded
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #FB923C 0%, #F97316 100%)",
                        boxShadow: "0 8px 28px rgba(249, 115, 22, 0.5)",
                        transform: "translateY(-2px)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                    type="primary"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </Button>
                </motion.div>
              )}
            </Box>
            {!largerThenMd && (
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: 1,
                    p: 1.5, // Increased padding for better touch target
                    borderRadius: "10px",

                    background: "rgba(249, 115, 22, 0.1)",
                    border: "1px solid rgba(249, 115, 22, 0.2)",
                    transition: "all 0.3s ease",
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      background: "rgba(249, 115, 22, 0.2)",
                      transform: "scale(1.02)",
                      boxShadow: "0 4px 16px rgba(249, 115, 22, 0.3)",
                    },
                    "&:active": {
                      transform: "scale(0.95)",
                    },
                    // Add subtle gradient overlay
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, transparent 50%)",
                      borderRadius: "inherit",
                      pointerEvents: "none",
                    },
                  }}
                  onClick={() => toggleMobileNav(!mobileNavOpen)}
                >
                  <MenuButton
                    isOpen={mobileNavOpen}
                    color="#F97316"
                    strokeWidth="2.5" // Slightly thicker for better visibility
                    transition={{ ease: "easeOut", duration: 0.3 }}
                    width="12" // Slightly larger
                    height="12"
                  />
                </Box>
              </motion.div>
            )}
          </Box>{" "}
        </Box>
      </motion.div>
    </NoSsr>
  );
};
export { AppBar };
