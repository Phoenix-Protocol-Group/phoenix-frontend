import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";

function DisclaimerModal({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{"Staging Environment Disclaimer"}</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Welcome to our staging environment, designed specifically for SCF
          voters to test the current state of our platform.
        </Typography>
        <Typography gutterBottom>
          <strong>Test Environment on Mainnet:</strong>
          <br /> This is a test environment deployed on the mainnet. Please use
          extremely low amounts for testing. Any funds used here are considered
          lost.
        </Typography>
        <Typography gutterBottom>
          <strong>Limited Liquidity Pool:</strong>
          <br /> We have only one liquidity pool available: USDC/XLM. This
          limits transactions to XLM and USDC only, with a pool liquidity under
          $20. To avoid slippage errors, we recommend swapping tiny amounts,
          like 0.0005 XLM or USDC.
        </Typography>
        <Typography gutterBottom>
          <strong>Token Selection Limitations:</strong> <br /> You may encounter
          an empty modal when trying to change tokens on the swap page. This is
          due to our current two-token limit. Use the arrow in the middle of the
          swap interface to switch between USDC/XLM and XLM/USDC.
        </Typography>
        <Typography gutterBottom>
          <strong>Inaccurate Dollar Values:</strong> <br /> Dollar value
          conversions may not be accurate. We are actively working to correct
          these figures as we move toward finalizing the mainnet version.
        </Typography>
        <Typography gutterBottom>
          Despite this being a mainnet deployment, we are still in the early
          stages of product development and pre-launch. If you encounter any
          issues or have questions, please contact us via Discord or Telegram.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Understood</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DisclaimerModal;
