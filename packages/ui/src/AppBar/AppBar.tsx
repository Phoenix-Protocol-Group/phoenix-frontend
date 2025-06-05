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
import { Button } from "../Button/Button";
import { MenuButton } from "./MenuButton";
import { AppBarProps } from "@phoenix-protocol/types";

const BalanceChip = ({ balance }: { balance: number }) => (
  <Chip
    icon={<Box component="img" src="/image-103.png" />}
    label={
      <Typography
        sx={{
          fontSize: "0.8125rem",
          lineHeight: "1.125rem",
          opacity: 1,
          color: "var(--neutral-300, #D4D4D4)",
        }}
      >
        {balance} XLM
      </Typography>
    }
    sx={{
      padding: "0.75rem!important",
      background: "var(--neutral-800, #262626)",
      borderColor: "var(--neutral-700, #404040)",
    }}
    variant="outlined"
  />
);

const OptionMenu = ({
  disconnectWallet,
  walletAddress,
}: {
  disconnectWallet: () => void;
  walletAddress: string;
}) => {
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
          sx={{ color: "var(--neutral-300, #D4D4D4)" }}
        >
          <MoreVertIcon />
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
            width: "20ch",
            borderRadius: "16px",
            background: "var(--neutral-800, #262626)",
            color: "var(--neutral-300, #D4D4D4)",
          },
        }}
      >
        <MenuItem
          sx={{ display: "block" }}
          onClick={() => {
            navigator.clipboard.writeText(walletAddress);
            handleClose();
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8125rem",
              opacity: 1,
              color: "var(--neutral-300, #D4D4D4)",
            }}
          >
            Wallet Address
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <ContentCopyIcon
              fontSize="small"
              sx={{ color: "var(--neutral-400, #A3A3A3)" }}
            />
            <Typography
              sx={{
                fontSize: "0.8125rem",
                opacity: 1,
                color: "var(--neutral-300, #D4D4D4)",
              }}
            >
              {walletAddress.slice(0, 15)}
              ...
            </Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ background: "var(--neutral-700, #404040)" }} />
        <MenuItem
          sx={{ color: "var(--neutral-300, #D4D4D4)" }}
          onClick={() => {
            disconnectWallet();
            handleClose();
          }}
        >
          Disconnect Wallet
        </MenuItem>
      </Menu>
    </Box>
  );
};

const AppBar = ({
  balance,
  walletAddress,
  mobileNavOpen,
  connectWallet,
  disconnectWallet,
  toggleMobileNav,
}: AppBarProps) => {
  const theme = useTheme();
  const largerThenMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <NoSsr>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "3rem",
          background: largerThenMd
            ? "transparent"
            : "linear-gradient(180deg, #1A1C20 0%, #0E1011 100%)",
          position: { xs: "fixed", md: "absolute" },
          top: 0,
          left: 0,
          width: "100%",
          p: "0.8rem 0.3rem",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: "1rem",
            maxHeight: "54px",
          }}
        >
          <Box component="img" src="/logo_icon.svg" />
        </Box>
        <Box sx={{ display: "flex", mr: { xs: 2, md: 1.3 } }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {walletAddress && balance >= 0 && <BalanceChip balance={balance} />}
            <OptionMenu
              walletAddress={walletAddress || ""}
              disconnectWallet={disconnectWallet}
            />
            {!walletAddress || balance < 0 ? (
              <Button
                className={"connect-wallet"}
                size="small"
                sx={{ mr: { xs: 3, md: 1 }, padding: { sx: 2, md: 2 } }}
                type="primary"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            ) : null}
          </Box>
          {!largerThenMd && (
            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              <MenuButton
                isOpen={mobileNavOpen}
                onClick={() => toggleMobileNav(!mobileNavOpen)}
                color="white"
                strokeWidth="1"
                transition={{ ease: "easeOut", duration: 0.2 }}
                width="20"
                height="8"
              />
            </Box>
          )}
        </Box>
      </Box>
    </NoSsr>
  );
};
export { AppBar };
