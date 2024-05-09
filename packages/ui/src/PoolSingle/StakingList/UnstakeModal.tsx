import React from "react";
import { Alert, Box, Modal as MuiModal, Typography } from "@mui/material";
import { Token } from "@phoenix-protocol/types";
import Colors from "../../Theme/colors";
import { TokenBox } from "../../Swap";
import { Button } from "../../Button/Button";

interface UnstakeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  timestamp: number;
  maxAmount: number;
  unstake: (amount: number, timestamp: number) => void;
  token: Token;
}

const UnstakeModal = ({
  open,
  setOpen,
  timestamp,
  maxAmount,
  unstake,
  token,
}: UnstakeModalProps): React.ReactNode => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 460,
    background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "16px",
  };

  const [tokenCValue, setTokenCValue] = React.useState<string>("0");

  return (
    <MuiModal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="connectwallet-modal"
      aria-describedby="connect your wallet to the app"
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "24px", fontWeight: 700, mt: "1rem" }}>
            Unstake
          </Typography>
          <Box
            onClick={() => setOpen(false)}
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

        <TokenBox
          onChange={(val) => setTokenCValue(val)}
          value={tokenCValue}
          token={{...token, amount: maxAmount}}
          hideDropdownButton={true}
        />
        <Alert severity="info" sx={{ my: "1rem" }}>
          When you unstake, you will receive your staked tokens back to your
          wallet. If you want to stake again, you will need start with 0 days
          locked period again.
        </Alert>
        <Button
          onClick={() => unstake(Number(tokenCValue), timestamp)}
          sx={{ mt: "0.5rem" }}
          fullWidth
          // @ts-ignore
          variant="primary"
        >
          Unstake
        </Button>
      </Box>
    </MuiModal>
  );
};

export { UnstakeModal };
