import React from "react";
import {
  ConnectWalletProps,
  OptionComponentProps,
  Connector,
} from "@phoenix-protocol/types";
import { Box, Typography, Modal, Button } from "@mui/material";
import { Button as PhoenixButton } from "../Button/Button";
import Colors from "../Theme/colors";

const OptionComponent = ({
  connector,
  onClick,
  selected,
}: OptionComponentProps) => {
  const styleHovered = {
    background:
      "linear-gradient(137deg, rgba(226, 73, 26, 0.20) 0%, rgba(226, 27, 27, 0.20) 17.08%, rgba(226, 73, 26, 0.20) 42.71%, rgba(226, 170, 27, 0.20) 100%)",
    cursor: "pointer",
    border: "2px solid #E2621B",
    transition: "all 0.1s ease-in-out",
  };

  const style = {
    display: "flex",
    padding: "1.125rem 1.5rem",
    alignItems: "center",
    gap: "1rem",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
    border: "2px solid transparent",
    width: "100%",
    mt: "1.5rem",
    borderRadius: "8px",
    transition: "all 0.1s ease-in-out",
    "&:hover": {
      ...styleHovered,
    },
  };

  return (
    <Box
      onClick={onClick}
      sx={selected ? { ...style, ...styleHovered } : style}
    >
      <img
        src={connector.iconUrl}
        width="37"
        height="37"
        alt={connector.name}
      />
      <Typography>{connector.name}</Typography>
    </Box>
  );
};

const ConnectWallet = ({
  open,
  setOpen,
  connectors,
  connect,
}: ConnectWalletProps): React.ReactNode => {
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<Connector | undefined>(
    undefined
  );

  const doConnect = async (connector: Connector) => {
    setLoading(true);
    await connect(connector);
    setLoading(false);
    setOpen(false);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { md: 512, xs: "96vw" },
    background: "linear-gradient(180deg, #292B2C 0%, #1F2123 100%)",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column" as "column",
    padding: "1.5rem",
  };

  return (
    <Modal
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
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{ fontSize: 24, fontWeight: 700 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Connect wallet
          </Typography>
          <Box
            sx={{
              display: "flex",
              padding: "0.25rem",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: Colors.inputsHover,
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <Box
              onClick={() => setOpen(false)}
              component="img"
              sx={{
                h: "1.5rem",
                w: "1.5rem",
              }}
              src="/x.svg"
            />
          </Box>
        </Box>
        {!loading ? (
          <>
            <Typography sx={{ fontSize: 14, opacity: 0.4, mt: "1.5rem" }}>
              Start by connecting with one of the wallets below.
            </Typography>
            {connectors.map((connector) => (
              <div
                style={{ width: "100%" }}
                className={connector.id + "-element"}
                key={connector.id}
              >
                <OptionComponent
                  connector={connector}
                  selected={selected === connector}
                  onClick={() => setSelected(connector)}
                />
              </div>
            ))}
            <PhoenixButton
              disabled={!selected}
              // @ts-ignore
              variant="primary"
              sx={{ mt: "1.5rem", width: "100%" }}
              onClick={() => doConnect(selected!)}
            >
              Continue
            </PhoenixButton>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              padding: "1.5rem",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.75rem",
              flex: "1 0 0",
              alignSelf: "stretch",
              background: "#2C2C31",
              borderRadius: "16px",
              mt: "1.5rem",
            }}
          >
            <img
              src={
                selected.id === "freighter"
                  ? "/image-105.png"
                  : selected.iconUrl
              }
              style={{ width: "100%" }}
            />
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
              Opening Freighter
            </Typography>
            <Typography
              sx={{ fontSize: "0.875rem", opacity: 0.4, mt: "-0.47rem" }}
            >
              Please confirm in the {selected.name} app
            </Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export { ConnectWallet };
