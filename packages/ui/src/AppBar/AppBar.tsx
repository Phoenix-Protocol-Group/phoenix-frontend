import {
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React from "react";
import { Button } from "../Button/Button";

const BalanceChip = ({ balance }: { balance: number }) => (
  <Chip
    icon={<Box component="img" src="image-103.png" />}
    label={
      <Typography
        sx={{
          fontSize: "0.8125rem",
          lineHeight: "1.125rem",
          opacity: 0.6,
        }}
      >
        {balance} XLM
      </Typography>
    }
    sx={{ padding: "0.75rem!important" }}
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
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
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
            background: "#1D1F21",
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
          <Typography sx={{ fontSize: "0.8125rem", opacity: 0.6 }}>
            Wallet Address
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <ContentCopyIcon fontSize="small" />
            <Typography sx={{ fontSize: "0.8125rem", opacity: 0.6 }}>
              {walletAddress.slice(0, 15)}
              ...
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            disconnectWallet();
            handleClose();
          }}
        >
          Disconnect Wallet
        </MenuItem>
      </Menu>
    </div>
  );
};

interface AppBarProps {
  balance: number | undefined;
  walletAddress: string | undefined;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const AppBar = ({
  balance,
  walletAddress,
  connectWallet,
  disconnectWallet,
}: AppBarProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "end", marginBottom: "3rem" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {walletAddress && balance ? (
          <>
            <BalanceChip balance={balance} />
            <OptionMenu
              walletAddress={walletAddress}
              disconnectWallet={disconnectWallet}
            />
          </>
        ) : (
          // @ts-ignore
          <Button variant="primary" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default AppBar;
